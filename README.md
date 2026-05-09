# Karan Belani — Portfolio

Personal portfolio and technical blog for Karan Belani, Network Security Engineer. Built with Next.js 15 and TinaCMS, featuring an interactive 3D network globe, dark/light mode, and a blog focused on networking, routing, switching, and VPN security topics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, React 18) |
| Language | TypeScript 5.9 |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) (CSS-first config via `@theme`) + custom CSS variables |
| CMS | [TinaCMS v3](https://tina.io/) — Git-backed, Markdown/MDX content |
| 3D Globe | [react-globe.gl](https://github.com/vasturiano/react-globe.gl) + Three.js |
| Animation | [Motion (Framer Motion)](https://motion.dev/) |
| Syntax Highlight | [Shiki](https://shiki.style/) |
| Theme | [next-themes](https://github.com/pacocoursey/next-themes) |
| Icons | [Lucide React](https://lucide.dev/), [React Icons](https://react-icons.github.io/react-icons/) |
| Fonts | Playfair Display · Instrument Sans · DM Mono (via `next/font/google`) |
| Linter | [Biome](https://biomejs.dev/) |
| Package Manager | pnpm |

---

## Project Structure

```
karan-belani-portfolio/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout — fonts, ThemeProvider, VideoDialog
│   ├── page.tsx                  # Homepage (Hero, About, Certifications, BlogPreview, Contact)
│   ├── not-found.tsx             # 404 page
│   ├── blogs/
│   │   ├── page.tsx              # Blog index — server component, passes data to BlogList
│   │   └── [slug]/page.tsx       # Blog post detail — SSG with generateStaticParams
│   └── [...urlSegments]/         # TinaCMS admin catch-all route
│
├── components/
│   ├── Nav.tsx                   # Site navigation — desktop links, hamburger, dark mode toggle
│   ├── sections/
│   │   ├── Hero.tsx              # Hero — two-column layout with NetworkGlobe on desktop
│   │   ├── About.tsx             # About section
│   │   ├── Certifications.tsx    # CCNA / CCNP SVPN cards with click-to-view cert modal
│   │   ├── BlogPreview.tsx       # Homepage blog preview grid (latest posts)
│   │   └── Contact.tsx           # Contact section
│   ├── blog/
│   │   ├── BlogList.tsx          # Client component — search + category filter for /blogs
│   │   └── PostBody.tsx          # Client wrapper for TinaMarkdown rich-text renderer
│   ├── ui/
│   │   ├── NetworkGlobe.tsx      # Interactive 3D globe (WebGL, dynamic import, SSR-safe)
│   │   ├── VideoDialog.tsx       # Full-screen video modal (sandboxed iframe)
│   │   └── VideoDialogContext.tsx # Context + URL allowlist for VideoDialog
│   ├── magicui/
│   │   └── script-copy-btn.tsx   # Syntax-highlighted copy button (Shiki, TinaCMS block)
│   └── motion-primitives/        # Reusable animation wrappers (text-effect, infinite-slider…)
│
├── content/                      # Git-backed CMS content (edited via TinaCMS or directly)
│   ├── categories/
│   │   ├── ccna.json
│   │   └── ccnp-svpn.json
│   ├── posts/
│   │   ├── stp-spanning-tree-protocol.mdx
│   │   └── dmvpn-dynamic-multipoint-vpn.mdx
│   ├── pages/home.mdx
│   └── global/index.json
│
├── tina/
│   ├── config.tsx                # TinaCMS schema — collections, fields, rich-text templates
│   ├── queries/queries.gql       # GraphQL queries for posts and categories
│   ├── fields/                   # Custom TinaCMS field components
│   └── __generated__/            # Auto-generated client + types (do not edit manually)
│
├── styles.css                    # Global styles — CSS custom properties, all component styles
├── next.config.ts                # Next.js config — rewrites, image domains
├── tsconfig.json
└── biome.json                    # Linter config
```

---

## Local Development

### Prerequisites

- Node.js 20+ (Active LTS)
- pnpm

### Install

```bash
pnpm install
```

### Run dev server

```bash
pnpm dev
```

This starts the TinaCMS local content server (port 4001) and the Next.js dev server (port 3000) together.

| URL | Purpose |
|---|---|
| `http://localhost:3000` | Portfolio site |
| `http://localhost:3000/admin` | TinaCMS visual editor |
| `http://localhost:4001/altair/` | GraphQL playground |

### Build locally (no Tina Cloud needed)

```bash
pnpm build-local
```

Runs `tinacms build --local --skip-indexing --skip-cloud-checks` then `next build`. Use this to verify production builds without a Tina Cloud account.

---

## Content Management

Content lives in the `content/` directory as Markdown/MDX and JSON files. It can be edited:

- **Visually** — via the TinaCMS editor at `/admin`
- **Directly** — by editing files in `content/` and committing to the repo

### Blog posts

Posts are `.mdx` files in `content/posts/`. Frontmatter fields:

```yaml
title: "Post Title"
description: "Short summary shown on cards"
category: ccna           # matches a file in content/categories/
publishedAt: 2025-01-10T00:00:00.000Z
readTime: "7 min read"
```

### Categories

Categories are `.json` files in `content/categories/`:

```json
{ "name": "CCNA", "description": "..." }
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values for production (Tina Cloud) builds:

```env
NEXT_PUBLIC_TINA_CLIENT_ID=   # from app.tina.io
TINA_TOKEN=                   # from app.tina.io
NEXT_PUBLIC_TINA_BRANCH=      # branch Tina Cloud reads from (e.g. main)
```

Not needed for `pnpm dev` or `pnpm build-local` (local mode bypasses Tina Cloud).

---

## Key Design Decisions

- **Dark mode default** — CSS custom properties in `:root` define the dark palette; `.light` class overrides to a warm off-white. Toggled by `next-themes` which sets `class="light"` on `<html>`.
- **Globe is SSR-safe** — `react-globe.gl` (WebGL/Three.js) is imported via `next/dynamic` with `{ ssr: false }`. Arc animation timing is randomised per-arc so pulses never sync up. Auto-rotation resumes 1.5 s after the user releases the globe.
- **TinaMarkdown in client boundary** — TinaCMS's rich-text renderer (`TinaMarkdown`) is wrapped in a `'use client'` `PostBody` component to ensure safe usage inside App Router server components.
- **Static blog generation** — `generateStaticParams` pre-renders all blog posts at build time. Falls back to on-demand rendering if Tina's server is unreachable during build.

---

## Deployment

The site is configured for deployment on Vercel. Set the three environment variables above in your Vercel project settings and deploy from the `main` branch. A GitHub Actions workflow (`build-and-deploy.yml`) is also included for GitHub Pages static export (requires `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN` as repository secrets).

---

## License

[Apache 2.0](./LICENSE)
