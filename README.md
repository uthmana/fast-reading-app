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
test
```

```bash
# Migrations are to be generated in the Dev server and taken to the production server
# In Production run
npx prisma migrate deploy
# or
npm run migrate:deploy
```
