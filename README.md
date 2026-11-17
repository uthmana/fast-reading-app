
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Scripts

| Task | Command |
| --- | --- |
| Run locally (dev server) | `.\scripts\run.ps1` or `npm run run:local` |
| Run locally with DB sync | `.\scripts\run.ps1 -Migrate` |
| Run production build locally | `.\scripts\run.ps1 -Prod` |
| Migrate DB (server/local) | `bash scripts/migrate.sh` or `npm run db:migrate` |
| Force schema sync | `bash scripts/migrate.sh --push` or `npm run db:push` |
| Seed DB | `npm run db:seed` |
| Deploy on server | `bash scripts/deploy.sh` (runs automatically on push to `main`) |

## Deploy to Plesk (GitHub Actions)

Pushing to `main` runs `.github/workflows/deploy.yml`, which SSHes into the server and runs `scripts/deploy.sh`.

One-time setup:

1. In Plesk, create the Node.js app and clone the repo into its folder (Git extension, or `git clone` over SSH).
2. Create `.env` in that folder on the server (it is not in git): `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_BASE_PATH`.
3. In GitHub, add repository secrets:
   - `PLESK_HOST`, `PLESK_USER`, `PLESK_SSH_KEY`, `PLESK_APP_PATH` (the app folder on the server)
   - `PLESK_SSH_PORT` (optional, defaults to 22)
   - `PLESK_RESTART_CMD` (optional, e.g. `pm2 restart fast-reading-app`)
4. Make sure `node`/`npm` are on the PATH for SSH sessions. Plesk's Node.js settings show the path.

Notes:
- `prisma/migrations` is git-ignored and currently empty, so migrations fall back to `prisma db push`. To use proper migration history, create migrations locally with `npx prisma migrate dev --name <name>`, then remove `prisma/migrations` from `.gitignore` and commit them.
- `NEXT_PUBLIC_BASE_PATH` is baked in at build time, so every deploy rebuilds the app.
- `deploy.sh` runs `git reset --hard` on the server. Do not edit files directly on the server.
