import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    env: {
      JWT_ACCESS_TOKEN_SECRET: "test-access-secret",
      JWT_REFRESH_TOKEN_SECRET: "test-refresh-secret",
    },
  },
});
