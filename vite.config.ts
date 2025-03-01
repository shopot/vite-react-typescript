import crypto from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { config } from 'dotenv';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { createProxy } from './vite.setupProxy';

const isDev = process.env.NODE_ENV === 'development';

const tsConfigPath = './tsconfig.app.json';

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
  resolve: { alias: { ...getAliasesFromTsConfig(tsConfigPath) } },
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

function resolvePath(path: string = '.'): string {
  return resolve(__dirname, '.', path);
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

function getAliasesFromTsConfig(tsConfigPath: string) {
  let tsConfig: JSON & { compilerOptions: { paths: Record<string, string[]> } } = null!;

  try {
    tsConfig = JSON.parse(readFileSync(tsConfigPath, 'utf8'));
  } catch (err) {
    console.error(err);
  }

  const aliases: Record<string, string[]> = tsConfig.compilerOptions.paths || {};

  const aliasesMap = new Map();

  Object.entries(aliases).forEach(([alias, [path]]) => {
    if (!alias.includes('@reduxjs')) {
      const key = alias.replace('/*', '');

      aliasesMap.set(key, resolvePath(path.replace('/*', '')));
    }
  });

  return Object.fromEntries(aliasesMap);
}
