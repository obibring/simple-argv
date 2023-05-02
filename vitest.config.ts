/// <reference types="vitest" />
/// <reference types="vite/client" />

import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true, // * Include vitest's functionality in globals
    environment: "node",
  },
})
