import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import { visualizer } from 'rollup-plugin-visualizer';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: 'src/assets/**/*.svg',
    }),
    visualizer({
      open: true, //To see the bundling result after build
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          react: ['react', 'react-dom'],

          // Editor-related
          lexical: [
            'lexical',
            '@lexical/html',
            '@lexical/link',
            '@lexical/rich-text',
            '@lexical/react/LexicalComposer',
            '@lexical/react/LexicalRichTextPlugin',
            '@lexical/react/LexicalContentEditable',
            '@lexical/react/LexicalHistoryPlugin',
            '@lexical/react/LexicalErrorBoundary',
            '@lexical/react/LexicalLinkPlugin',
            '@lexical/react/LexicalOnChangePlugin',
            '@lexical/react/LexicalListPlugin',
            '@lexical/react/LexicalComposerContext',
          ],

          // Form & validation
          form: ['react-hook-form', '@hookform/resolvers', 'zod'],

          // UI / motion
          motion: ['motion/react'],
          toast: ['react-toastify'],
          spinner: ['react-spinners'],
          dropzone: ['react-dropzone'],

          // Icon libraries
          icons: ['lucide-react', '@iconify/react'],

          // Date utils
          date: ['date-fns'],

          // Others
          radix: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-alert-dialog',
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
