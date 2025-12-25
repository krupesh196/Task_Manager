import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8800',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('@reduxjs') || id.includes('redux')) return 'redux-vendor';
            if (id.includes('firebase')) return 'firebase-vendor';
            if (id.includes('recharts')) return 'recharts-vendor';
            if (id.includes('react-icons')) return 'icons-vendor';
            if (id.includes('moment')) return 'moment-vendor';
            if (id.includes('sonner')) return 'sonner-vendor';
            return 'vendor';
          }
        },
      },
    },
    sourcemap: false,
  },
})
