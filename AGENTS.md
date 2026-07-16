# Project Guide for AI Agents

## Tech Stack
- **Framework:** Astro 5.x
- **UI Library:** React 19.x
- **Styling:** Tailwind CSS 4.x (via `@tailwindcss/vite`)
- **Language:** TypeScript (strict mode)

## Commands
- `npm run dev` — Start dev server at `localhost:4321`
- `npm run build` — Build for production to `./dist/`
- `npm run preview` — Preview production build locally
- `npm run astro` — Run Astro CLI commands

## Project Structure
```
/public          — Static assets (images, etc.)
/src/
  /pages/        — Page routes (.astro files)
  /components/   — Reusable Astro/React components
  /layouts/      — Layout components
  /lib/          — Utility functions and shared logic
/astro.config.mjs — Astro configuration
```

## Conventions
- Use `.astro` files for pages and layouts
- Use React (`.tsx`) for interactive components
- Use Tailwind utility classes for styling (no CSS modules or styled-components)
- All new files should use TypeScript
- Place reusable utilities in `src/lib/`
- Keep components focused and single-responsibility

## Git
- Main branch: `main`
- Commits should be descriptive and in English
- Run `npm run build` before committing to verify no errors
