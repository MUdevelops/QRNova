import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Netlify exposes the primary site URL as `URL` at build time. It is used for absolute social-image URLs.
const siteUrl = (process.env.URL || process.env.SITE_URL || '').replace(/\/$/, '');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: (html: string) => html.split('%SITE_URL%').join(siteUrl),
    },
  ],
  build: {
    target: 'es2020',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          qr: ['qr-code-styling'],
        },
      },
    },
  },
});
