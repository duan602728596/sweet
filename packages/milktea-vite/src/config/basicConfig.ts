import * as path from 'path';
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
        sass: {
          fiber: false
        }
      }
    },
    build: {
      assetsDir: ''
    },
    resolve: {
      extensions: ['.mjs', '.ts', '.tsx', '.js', '.jsx', 'cjs', '.json', '.vue', '.wasm']
    }
  };
}