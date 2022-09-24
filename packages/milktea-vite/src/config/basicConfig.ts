import * as path from 'node:path';
import type { InlineConfig } from 'vite';
import type { SweetOptions } from '../utils/types.js';

/**
 * 基础配置
 * @param { SweetOptions } sweetOptions
 */
export function basicConfig(sweetOptions: SweetOptions): InlineConfig {
  return {
    root: path.join(sweetOptions.basicPath, 'src'),
    base: '',
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        },
        sass: {}
      }
    },
    build: {
      assetsDir: ''
    },
    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.mjs',
        '.cjs',
        '.mts',
        '.cts',
        '.jsx',
        '.vue',
        '.json',
        '.wasm'
      ]
    }
  };
}