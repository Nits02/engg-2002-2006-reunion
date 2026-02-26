import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/engg-2002-2006-reunion/',
  plugins: [react(), tailwindcss()],
})
