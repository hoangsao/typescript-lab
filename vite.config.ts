import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiProxyUrl = env.VITE_API_PROXY;

  return {
    plugins: [react()],
    server: {
      host: 'app.local', // or true, or '0.0.0.0' or '192.168.1.x'
      port: 5173, // default port: 5173
      proxy: {
        '/api': {
          target: apiProxyUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
  };
});