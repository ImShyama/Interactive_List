import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-table-column-resizer": "node_modules/react-table-column-resizer/index.js",
    },
  },
  optimizeDeps: {
    // Pre-bundle this dependency if it's causing issues
    include: ["react-table-column-resizer"],
  },
})
