# rastrigin.systems

The company site of Rastrigin Systems Ltd: one static page that says what the
company is, what it owns, how it works, and where it is registered. Built with
Astro 5 and plain CSS, deployed as a Cloudflare Worker that serves `dist/` as
static assets (`wrangler.jsonc`, `assets.directory = ./dist`). It is a Worker,
not a Pages project.

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
```

## Deploy

```bash
npm run build && npx wrangler deploy
```

There is no deploy on push. `wrangler deploy` uploads `dist/` under the Worker
named in `wrangler.jsonc`.

## Layout

```
src/
├── layouts/Layout.astro   # head, fonts, masthead, footer
├── pages/index.astro      # the page: all of the copy lives here
└── styles/global.css      # tokens (light and dark), type, spacing, the few components
public/                    # favicons, robots.txt
```

## Design

The page follows Vercel's public `design.md` (https://vercel.com/design.md):
Geist Sans for text and Geist Mono only for identifiers (the company number,
the incorporation date, the email), monochrome tokens with light and dark via
`prefers-color-scheme`, tight gaps inside a group and wide ones between groups,
and none of the named anti-patterns (eyebrows, section numbers, gradients,
cards, icon tiles, hero-over-grid). Geist is loaded from Google Fonts; nothing
else external is loaded.

Facts on the page (company number, dates, address) are verified against the
Companies House record. Change them there first.
