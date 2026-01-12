# rastrigin-systems

Personal website/blog built with Astro.

## Mermaid Diagrams

Diagrams use pre-generated SVGs, not runtime Mermaid rendering.

**Pattern:**
```html
<div class="mermaid-diagram" data-code="[mermaid code here]">
  <img src="/diagrams/[name].svg" alt="[description]" />
</div>
```

**To generate a new diagram:**
1. Create a `.mmd` file with the Mermaid code
2. Run: `npx mmdc -i diagram.mmd -o public/diagrams/name.svg -t dark -b transparent`
3. Use the `<div class="mermaid-diagram">` pattern in markdown
4. Delete the temp `.mmd` file

**Existing diagrams:**
- `/public/diagrams/proxy-flow.svg` - MITM proxy flow (article 1)
- `/public/diagrams/request-flow.svg` - Request/response flow (article 1)
- `/public/diagrams/system-prompt-flow.svg` - System prompt architecture (article 2)

## Blog Articles

Claude Code series in `/src/content/blog/`:
- `claude-code-part-1-requests.md` - HTTP interception and request analysis
- `claude-code-part-2-system-prompt.md` - System prompt breakdown
- `claude-code-part-3-tools.md` - Tools analysis (planned)

## Styling

- Use `<div class="synthesis">` for summary/conclusion sections
- Use tables for comparisons (Static vs Dynamic, Sent vs Local)
- Code blocks: use `markdown` for system prompt excerpts, `json` for API payloads

## Writing Style (Claude Code Series)

**Tone: Discovery, not expertise.** The author is sharing interesting findings, not claiming to understand LLM internals.

**Do:**
- "I noticed..." / "I found..." / "Here's what I saw..."
- "My guess is..." / "My take:" / "My read:"
- "Maybe..." / "Or maybe I'm reading too much into it"
- "I haven't tried it, but my assumption is..."
- "This seems to..." / "It looks like..."
- Frame interpretations as questions: "Can you bypass this?"

**Don't:**
- Claim to know why Anthropic made design decisions
- Explain how LLMs "process" or "think" internally
- Use words like "internalized", "self-concept", "behavioral pressure"
- State interpretations as facts (e.g., "This prevents X" → "Presumably to prevent X")
- Claim to have tested something you didn't test

**HN-proofing checklist:**
- [ ] No claims about LLM internals without hedging
- [ ] No "secret" / "exposed" clickbait language
- [ ] Security claims hedged ("my assumption" not "you can't")
- [ ] Speculation clearly marked as speculation
- [ ] No anthropomorphizing the model
- [ ] Link to raw data (gist) for readers who want primary source
