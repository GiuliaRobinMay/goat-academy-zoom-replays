import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` emits a single self-contained dist/index.html so the app can be
// previewed or dropped anywhere without an asset server. Remove viteSingleFile
// when this moves to a real host with a backend.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { target: 'es2020', assetsInlineLimit: 100000000, cssCodeSplit: false },
})
