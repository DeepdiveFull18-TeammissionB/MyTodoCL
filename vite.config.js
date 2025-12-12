import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // 2. 아래 내용 통째로 추가
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: '나의 그린 투두', // 설치하면 바탕화면에 뜰 이름
        short_name: 'GreenTodo',
        description: '나의 멋진 투두 리스트',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // 아이콘 파일 이름 (아래 설명 참고)
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
