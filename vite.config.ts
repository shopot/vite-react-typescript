import crypto from 'node:crypto';
import { fileURLToPath, URL } from 'node:url';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import { defineConfig, type PluginOption } from 'vite';
import autoprefixer from 'autoprefixer';
import { config } from 'dotenv';

config();

import { createProxy } from './vite.setupProxy';

const isDev = process.env.NODE_ENV === 'development';

const PORT = Number(process.env.PORT) || 5173;

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  plugins: [
    react(),
    visualizer({
      filename: 'report.html',
    }) as PluginOption,
  ],
  css: {
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: isDev ? generateScopedNameDevelopment : generateScopedNameProduction,
    },
    postcss: {
      plugins: [autoprefixer],
    },
  },
  resolve: {
    alias: {
      '@/app': fileURLToPath(new URL('./src/app', import.meta.url)),
      '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
      '@/modules': fileURLToPath(new URL('./src/modules', import.meta.url)),
      '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
      '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
    },
  },
  server: {
    open: true,
    port: PORT,
    host: '127.0.0.1',
    proxy: createProxy(),
  },
});

function createHash(filename: string) {
  return crypto.hash('sha1', filename);
}

function generateScopedNameDevelopment(name: string, filename: string) {
  const componentName = filename
    .replace('.module', '')
    .replace(/\.\w+$/, '')
    .split('/')
    .pop();

  const hash = createHash(filename).substring(0, 5);

  return `${componentName}_${name}__${hash}`;
}

function generateScopedNameProduction(name: string, filename: string) {
  return `_c${createHash(`${name}_${filename}`).substring(0, 8)}`;
}
