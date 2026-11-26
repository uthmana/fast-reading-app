// This file is added to silenced this warning
// warn The configuration property package.json#prisma is deprecated and will be removed in Prisma 7.
// Please migrate to a Prisma config file (e.g., prisma.config.ts).
// For more information, see: https://pris.ly/prisma-config
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    seed: "tsx prisma/seed.ts",
  },

  datasource: {
    url: env("DATABASE_URL"),
  },
});
