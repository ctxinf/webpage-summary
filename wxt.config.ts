import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'wxt';
import { visualizer } from 'rollup-plugin-visualizer';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  hooks: {
    'build:manifestGenerated': (wxt, manifest) => {
      if (wxt.config.mode === 'development') {
        // console.log('manifest',manifest)
        manifest.name = `(DEV-${wxt.config.browser})__MSG_extStoreName__`;
      }
    },
  },
  manifest: {
    name: '__MSG_extStoreName__',
    description: '__MSG_extDescription__',
    default_locale: 'en',
    host_permissions: ['<all_urls>'],
    permissions: ['activeTab', 'storage', 'contextMenus', 'scripting', 'cookies'],
    commands: {
      COMMAND_INVOKE_SUMMARY: {
        suggested_key: {
          default: 'Alt+S',
          mac: 'Command+S',
        },
        description: '__MSG_Commad_Open_Panel_DESC__',
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
