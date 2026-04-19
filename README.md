# Karan Belani — Portfolio

Personal portfolio site for Karan Belani, Network Engineer.

## Tech Stack

- [Next.js 15](https://nextjs.org/) — App Router, TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [pnpm](https://pnpm.io/) — package manager

> **CMS:** [Keystatic](https://keystatic.com/) will be added in a future iteration. Next.js 15 + App Router is fully compatible.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build with Turbopack |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Project Structure

```
app/
  layout.tsx   — Root layout with metadata and fonts
  page.tsx     — Home page
  globals.css  — Global styles
public/        — Static assets
```
