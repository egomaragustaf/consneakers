# Consneakers

A sneaker e-commerce demo built with React Router v7 (framework mode), Remix v2-style flat routes, Prisma, and Tailwind CSS.

## Stack

- [React Router v7](https://reactrouter.com) (framework mode, SSR)
- React 18
- Prisma (PostgreSQL)
- Tailwind CSS
- Radix UI primitives, conform-to (forms + zod validation)
- pnpm

## Getting Started

```sh
pnpm install
pnpm db:push   # push Prisma schema to the database
pnpm db:seed   # seed products and the test user
pnpm dev       # Vite dev server with HMR
```

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the Vite dev server |
| `pnpm build` | Production build (`build/client` + `build/server`) |
| `pnpm start` | Serve the production build with `react-router-serve` |
| `pnpm typecheck` | Run `tsc` |
| `pnpm db:gen` | Generate Prisma client |
| `pnpm db:push` | Push the schema to the database |
| `pnpm db:seed` | Seed the database (products + `app/data/users-credentials.json`) |
| `pnpm db:studio` | Open Prisma Studio |

## Environment

Copy `.env.example` to `.env` and fill in `DATABASE_URL` and `SESSION_SECRET`.

## Deployment

Zero-config on Vercel: the React Router builder runs `react-router build` and deploys `build/server` automatically.
