import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'wxt';
import { visualizer } from 'rollup-plugin-visualizer';

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
    web_accessible_resources: [
      {
        resources: ['icon/*', '*.svg', '*.png'],
        matches: ['<all_urls>'],
      },
    ],
  },
  vite: () => ({
    optimizeDeps: {
      entries: [
        'entrypoints/**/*.html',
        'entrypoints/**/*.{ts,tsx,js,jsx}',
        '!reference/**',
      ],
    },
    plugins: [visualizer({ filename: 'stats.html', open: false })],
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
