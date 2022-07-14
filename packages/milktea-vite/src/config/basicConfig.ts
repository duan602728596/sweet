import * as path from 'node:path';
// @ts-ignore Node16
import type { InlineConfig } from 'vite';
import type { SweetOptions } from '../utils/types';

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
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.jsx', '.vue', '.json', '.wasm']
    }
  };
}