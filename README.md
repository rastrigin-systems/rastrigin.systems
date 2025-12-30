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

1. Create a new file in `src/pages/blog/`:

```bash
touch src/pages/blog/your-post-slug.astro
```

2. Use this template:

```astro
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Your Post Title" description="Brief description for SEO">
  <article class="prose">
    <h1>Your Post Title</h1>
    <p class="text-[var(--color-text-muted)]">December 30, 2024</p>

    <p>Your content here...</p>

    <h2>Section heading</h2>
    <p>More content...</p>

    <pre><code>code blocks work too</code></pre>
  </article>
</Layout>
```

3. Add the post to the homepage list in `src/pages/index.astro`:

```typescript
const posts = [
  {
    title: "Your Post Title",
    date: "2024-12-30",
    slug: "your-post-slug",
    excerpt: "Brief description shown on homepage."
  },
  // ... other posts
];
```

4. Commit and push — it'll deploy automatically.

## Project Structure

```
src/
├── layouts/
│   └── Layout.astro      # Base layout with header/footer
├── pages/
│   ├── index.astro       # Homepage (blog listing)
│   ├── about.astro       # About page
│   └── blog/             # Blog posts go here
└── styles/
    └── global.css        # Theme colors and typography
```
