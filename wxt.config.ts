import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Webpage Summary React',
    host_permissions: ['<all_urls>'],
    permissions: ['activeTab', 'storage'],
  },
  vite: () => ({
    optimizeDeps: {
      entries: [
        'entrypoints/**/*.html',
        'entrypoints/**/*.{ts,tsx,js,jsx}',
        '!reference/**',
      ],
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  }),
});
