import * as path from 'path';
import * as _ from 'lodash';
import type { InlineConfig } from 'vite';
import { basicConfig } from './config/basicConfig';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * vite 生产环境编译配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): InlineConfig {
  const { mode, frame, vite, chainVite }: SweetConfig = sweetConfig;

  const viteConfig: InlineConfig = _.merge(basicConfig(sweetOptions), {
    mode,
    css: {
      modules: {
        generateScopedName: '_[hash:base64:6]'
      }
    },
    build: {
      outDir: path.join(__dirname, '../dist')
    }
  });

  if (frame === 'react') {
    // 添加react配置
    Object.assign(viteConfig, {
      esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        jsxInject: "import * as React from 'react';"
      }
    });
  }

  if (chainVite) {
    chainVite(viteConfig);
  }

  return _.merge(viteConfig, vite);
}