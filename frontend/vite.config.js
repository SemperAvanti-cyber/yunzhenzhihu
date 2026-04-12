import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        // 127.0.0.1 避免 Windows 上 localhost 首次解析/IPv6 慢导致首包 502
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
        timeout: 120_000,
        proxyTimeout: 120_000,
      },
      // 与后端 app.use('/uploads', express.static(...)) 对齐；否则 img 会请求到 5173 导致裂图
      '/uploads': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
})
