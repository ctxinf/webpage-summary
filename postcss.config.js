import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Shadow DOM does not isolate rem from the page's html font-size. Anchor
// generated utilities (including arbitrary values) only in the content UI.
const contentSizeAnchor = {
  postcssPlugin: 'content-size-anchor',
  OnceExit(root) {
    const file = root.source?.input.file?.replaceAll('\\', '/');
    if (!file?.endsWith('/entrypoints/content/style.css')) return;

    root.walkDecls((decl) => {
      decl.value = decl.value.replace(
        /(-?(?:\d*\.)?\d+)rem\b/g,
        'calc($1 * var(--webpage-summary-panel-srem, 16px))',
      );
    });
  },
};

export default {
  plugins: [tailwindcss(), autoprefixer(), contentSizeAnchor],
};
