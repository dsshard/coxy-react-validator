import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: 'esnext',
  clean: true,
  dts: true,
  treeshake: true,
  splitting: false,
  minify: true,
  sourcemap: true,
  external: ['react'],
})
