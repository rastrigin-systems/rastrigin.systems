---
title: "What Claude Code Actually Sends to the Cloud"
date: "2026-01-09"
subtitle: "Part 1 — The Wire"
excerpt: "An inspection of Claude Code's network requests, system prompt, and context handling by intercepting real traffic."
---

I built a proxy to see what Claude Code sends to the cloud. The answer: far more than most developers realize — and far more than the UI suggests. Your code, your git history, your project instructions—packaged into requests so large I thought my logging was broken.

## The Setup

Developers use AI coding agents daily. Claude Code, Cursor, Copilot, what—they read your code, run commands, write files. I wanted to know what’s actually being sent to the model. What information leaves my machine?

So I set up a MITM proxy to intercept Claude Code’s traffic to understand what’s actually being sent to the model. What information leaves my machine?
Claude Code is a Node.js application, which makes interception relatively straightforward—it respects standard proxy environment variables once you have the certificates configured.

<div class="mermaid-diagram" data-code="sequenceDiagram
    participant CC as Claude Code
    participant Proxy as MITM Proxy
    participant API as api.anthropic.com
    CC->>Proxy: HTTPS request
    Proxy->>Proxy: Decrypt & log
    Proxy->>API: Forward request
    API-->>Proxy: SSE response
    Proxy->>Proxy: Log response
    Proxy-->>CC: Forward to CLI">
  <img src="/diagrams/proxy-flow.svg" alt="MITM Proxy Flow" />
</div>

The proxy sees everything in plaintext. Every request, every response, every token streamed back.

## SSE vs WebSockets

My first surprise: no WebSockets. When you see text streaming in real-time, WebSockets seem like the obvious choice. But Claude Code uses SSE (Server-Sent Events) instead.

Why? For LLMs, SSE is the simpler choice:

- **One direction is enough.** You send a prompt, you get tokens back. The server never needs to push unprompted.

- **Plain HTTP.** Works with any load balancer, CDN, or corporate firewall. No WebSocket upgrade handshake to fail.

- **Auto-reconnect is trivial.** It’s just HTTP—reconnection logic is straightforward.

WebSockets would work, but why add complexity for capabilities you don’t need?

## The Request

Every time you hit enter, Claude Code builds a request containing:

- Your message

- The entire conversation history of the current session

- A massive system prompt (~15-25K tokens)

- Definitions for every tool it can use

- Context about your environment

Then it sends all of that to Anthropic’s servers. On every prompt. Always.

![Request Flow](/diagrams/request-flow.svg)

Here's the JSON structure:

```json
{
  "model": "claude-opus-4-5-20251101",
  "stream": true,
  "max_tokens": 16000,
  "system": [...],      // ~15,000+ tokens of instructions
  "tools": [...],       // Tool definitions (more on this in Part 3)
  "messages": [...]     // Your entire conversation
}
```

> **Want to see a real request?** Here’s what Claude Code sends when you type “hi, how are you today?” — [101 KB of JSON](https://gist.github.com/sergei-rastrigin/a7febd3570657fc270745d14f861016b) for a five-word message.

### The System Prompt

This is where it gets interesting. Claude Code injects a massive system prompt—often 15,000-25,000 tokens—before you’ve typed anything.

At a high level, the system prompt includes:

- Identity and behavior rules

- Your CLAUDE.md file (the entire thing)

- Environment info (OS, working directory, git status)

- Tool definitions and usage policies

- Security guidelines and examples

How exactly is this prompt assembled? Which parts are static vs. dynamic? Where does your CLAUDE.md get injected? That’s a deep rabbit hole—I’m covering it in [Part 2: The System Prompt](/blog/claude-code-part-2-system-prompt).

When I saw one of my logs hit 628 KB, I thought something was broken. Nope—just a normal request. This means roughly 20-30% of your context window is consumed by infrastructure before you’ve said a word. Something to keep in mind for long sessions.

### What About Caching?

Do you pay for that 25K system prompt every time?

Not quite. Anthropic has [prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching). Content marked with `cache_control` gets stored for 5 minutes:

- **First request:** Base price + 25% cache write cost

- **Cache hit:** Only 10% of base price (90% savings)

- **Cache refresh:** Free—each hit extends the 5-minute TTL

Claude Code caches the system prompt and tool definitions. Your conversation history? Full price every turn—it changes with each message.

So the system prompt is cheap after the first message. The expensive part is your conversation growing with every turn.

### The Conversation History

Here’s what caught me: **the full conversation is sent with every request**.

- Turn 1: You send your message.

- Turn 2: You send your message + Claude’s response + your new message.

- Turn 3: You send everything from turns 1-2 + your new message.

- …and so on.

Turn 50? You’re sending 50 copies of Claude’s responses plus your messages plus the system prompt.

The context grows until it hits the limit. Then Claude Code compresses: it generates a summary and starts fresh with that summary as history. This is why long sessions sometimes feel like Claude “forgot” something. It did. It summarized it away.

This is the trade-off of stateless architecture. You get simplicity and reliability. You pay with bandwidth and tokens.

### Your Files

When Claude reads a file, that file's contents become part of the conversation:

```json
{
  "role": "user",
  "content": [{
    "type": "tool_result",
    "tool_use_id": "toolu_abc123",
    "content": "// Contents of src/auth.ts\nexport function login(user, pass) {\n  // your actual code here\n..."
  }]
}
```

That code is now in the request. It will be sent with every subsequent message until the context resets.

## The Response

The response streams back as SSE events. Each event has a `type` and a `data` payload:

```jsonc
// 1. Stream starts - metadata about the response
{
  "event": "message_start",
  "data": {
    "type": "message_start",
    "message": {
      "id": "msg_01XFDUDYJgAACzvnptvVoYEL",
      "model": "claude-opus-4-5-20251101",
      "usage": { "input_tokens": 25000, "output_tokens": 1 }
    }
  }
}

// 2. Content arrives token by token
{ "event": "content_block_delta", "data": { "delta": { "text": "I'll" }}}
{ "event": "content_block_delta", "data": { "delta": { "text": " start" }}}
{ "event": "content_block_delta", "data": { "delta": { "text": " by" }}}

// 3. Keep-alive during "thinking" pauses
{ "event": "ping", "data": { "type": "ping" }}

// 4. Stream ends with final token count
{
  "event": "message_stop",
  "data": {
    "usage": { "input_tokens": 25000, "output_tokens": 127 }
  }
}
```

Each `content_block_delta` contains just a few tokens. Your terminal renders them as they arrive—that’s why text appears word by word. The `ping` events keep the HTTP connection alive during long thinking pauses.

<div class="synthesis">

## What This Means

| Sent to Anthropic | Stays Local |
|:--|:--|
| Every file Claude reads | Files Claude doesn’t read |
| Your CLAUDE.md instructions | Environment variables (unless in commands) |
| Command outputs |  |
| Working directory path |  |
| OS info |  |
| Git history |  |

Is this concerning? Depends on your threat model. For personal projects or open-source work, probably fine. For proprietary code or repos with secrets, think twice about what you let Claude read.

The good news: you control which files it accesses. The bad news: with three Claude Code windows open, I stopped reading the prompts and just clicked “yes.” Now I run with `--dangerously-skip-permissions`. The flag name says it all.

</div>

## Next Up

That system prompt—15-25K tokens of instructions—is where the real magic happens. How is it built? What does Claude actually “know” about you?

[Part 2: The System Prompt →](/blog/claude-code-part-2-system-prompt)