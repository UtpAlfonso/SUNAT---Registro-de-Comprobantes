import fs from 'fs';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig, Plugin} from 'vite';

function copyRootAppJsPlugin(): Plugin {
  return {
    name: 'copy-root-app-js',
    closeBundle() {
      const src = path.resolve(__dirname, 'app.js');
      const distDir = path.resolve(__dirname, 'dist');
      const dest = path.resolve(distDir, 'app.js');
      const publicDest = path.resolve(__dirname, 'public/app.js');
      if (fs.existsSync(src)) {
        if (!fs.existsSync(distDir)) {
          fs.mkdirSync(distDir, { recursive: true });
        }
        fs.copyFileSync(src, dest);
        fs.copyFileSync(src, publicDest);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), copyRootAppJsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
