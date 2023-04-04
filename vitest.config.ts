import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['test/**/*.ts', '**/*.spec.ts'],
    coverage: {
      all: true,
    },
    reporters: 'verbose'
  },
})
