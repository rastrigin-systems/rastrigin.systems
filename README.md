# rastrigin.systems

Personal site built with Astro and Tailwind CSS.

## Development

```bash
bun install
bun dev
```

Site runs at `http://localhost:4321`

## Deployment

Deployed to Cloudflare Pages. Pushes to `main` trigger automatic deploys.

```bash
git add -A && git commit -m "Your message" && git push
```

## Adding Blog Posts

Create a markdown file in `src/content/blog/`:

```markdown
---
title: "Your Post Title"
date: "2024-12-30"
excerpt: "Brief description shown on homepage."
---

Your content here. Supports **markdown** formatting.

## Headings work

So do code blocks:

```typescript
const x = 1;
```
```

That's it. The post automatically appears on the homepage, sorted by date.

## Project Structure

```
src/
├── content/
│   └── blog/             # Markdown blog posts go here
├── layouts/
│   └── Layout.astro      # Base layout with header/footer
├── pages/
│   ├── index.astro       # Homepage (auto-lists posts)
│   ├── about.astro       # About page
│   └── blog/
│       └── [slug].astro  # Dynamic blog post pages
└── styles/
    └── global.css        # Theme colors and typography
```
