import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    server: {
      host: '::',
      port: 8080,
      proxy: {
        // --- 1. Supabase Edge Functions (production) -----------------
        '/functions/v1': {
          target: 'https://fxffygvrkcsdfhachvuj.supabase.co',
          changeOrigin: true,
          rewrite: (p) => p,
          headers: { apikey: env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '' },
        },

        // --- 2. Fallback: call OpenBB directly (dev only) ------------
        '/api/openbb': {
          target: 'https://api.openbb.dev',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api\/openbb/, '/api/v1'),
          headers: { Authorization: `Bearer ${env.VITE_OPENBB_TOKEN}` },
        },
      },
    },

    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'FinanceGram',
          short_name: 'FinanceGram',
          description: 'Real-time financial data terminal',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10 MB
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 5 * 60,
                },
              },
            },
          ],
        },
      }),
    ].filter(Boolean),

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
  };
});
