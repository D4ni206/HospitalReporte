import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    hmr: {
      protocol: 'ws',
    },
    proxy: {
      '/api/dni': {
        target: 'https://dniruc.apisperu.com',
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          const token = process.env.VITE_APISPERU_TOKEN ||
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImthcmxhZGFuaWVsYXJhbW9zYmVsdHJhbkBnbWFpbC5jb20ifQ.AwtUIIQhccj10ww50W2kluuETegUcxrqBjsn9TYNC3I';

          proxy.on('proxyReq', (proxyReq, req) => {
            try {
              const originalUrl = new URL(req.url, 'http://localhost');
              const dni = originalUrl.searchParams.get('dni');
              if (dni) {
                proxyReq.path = `/api/v1/dni/${encodeURIComponent(dni)}?token=${encodeURIComponent(token)}`;
              }
            } catch (error) {
              console.error('Error rewriting /api/dni proxy path:', error);
            }
          });
        },
      },
    },
  },
})