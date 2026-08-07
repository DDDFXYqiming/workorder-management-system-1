import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5174,
    proxy: {
      // 接入真实后端时使用：/api 等路径转发到后端
      '/user': { target: process.env.VITE_BACKEND_URL ?? 'http://localhost:8080', changeOrigin: true },
      '/process': { target: process.env.VITE_BACKEND_URL ?? 'http://localhost:8080', changeOrigin: true },
      '/api': { target: process.env.VITE_BACKEND_URL ?? 'http://localhost:8080', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          tdesign: ['tdesign-react', 'tdesign-icons-react'],
          echarts: ['echarts', 'echarts-for-react'],
          axios: ['axios'],
        },
      },
    },
  },
})
