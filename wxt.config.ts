import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Webpage Summary React',
    host_permissions: ['<all_urls>'],
    permissions: ['activeTab', 'storage', 'contextMenus', 'scripting', 'cookies'],
    commands: {
      COMMAND_INVOKE_SUMMARY: {
        suggested_key: {
          default: 'Alt+S',
          mac: 'Command+S',
        },
        description: 'Open summary panel',
      },
      COMMAND_ADD_SELECTION: {
        suggested_key: {
          default: 'Alt+A',
          mac: 'Command+A',
        },
        description: 'Add selection to chat',
      },
    },
  },
  vite: () => ({
    optimizeDeps: {
      entries: [
        'entrypoints/**/*.html',
        'entrypoints/**/*.{ts,tsx,js,jsx}',
        '!reference/**',
      ],
    },
    // esbuild: {
    //   charset: 'ascii',
    // },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
      },
    },
  }),
});
