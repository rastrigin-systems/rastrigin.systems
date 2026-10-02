# rastrigin-systems

One static page for Rastrigin Systems Ltd. `README.md` says how it is built,
deployed and designed; read it first.

- All copy is in `src/pages/index.astro`. Every fact on the page is verified
  (Companies House, product sites). Add nothing that is not.
- Styling is plain CSS in `src/styles/global.css`, following
  https://vercel.com/design.md. Fetch that file, do not work from memory of it.
- No Tailwind, no content collections, no blog. They were removed on
  2026-10-02; `git log` has the old site if it is ever wanted.
- `npm run build` must pass before any change is called done. Deploy is
  `npx wrangler deploy` (a Worker serving `dist/`), never Pages.
