import * as path from 'path';
import type { InlineConfig } from 'vite';
import { requireModule, moduleExists } from '../utils/utils';
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
          fiber: moduleExists('fibers') ? requireModule('fibers') : false
        }
      }
    },
    build: {
      assetsDir: ''
    }
  };
}