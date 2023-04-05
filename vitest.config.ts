import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['test/**/*.ts', '**/*.spec.ts'],
    coverage: {
      include: ['src/**/*.ts'],
      all: true,
    },
    reporters: 'verbose',
  },
})
