import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../android/app/src/main/assets/mini-apps/app1',
    emptyOutDir: true,
  },
})
