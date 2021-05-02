import * as path from 'path';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { InlineConfig } from 'vite';
import { basicConfig } from './config/basicConfig';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * vite 生产环境编译配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<InlineConfig> {
  const { mode, frame, vite, chainVite }: SweetConfig = sweetConfig;
  const viteConfig: InlineConfig = _.merge(basicConfig(sweetOptions), {
    mode,
    css: {
      modules: {
        generateScopedName: '_[hash:base64:6]'
      }
    },
    build: {
      outDir: path.join(sweetOptions.basicPath, 'dist')
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
  } else if (frame === 'vue') {
    // 添加vue配置
    Object.assign(viteConfig, {
      plugins: [
        (await requireModule('@vitejs/plugin-vue'))(),
        (await requireModule('@vitejs/plugin-vue-jsx'))()
      ]
    });
  }

  if (chainVite) {
    await chainVite(viteConfig);
  }

  return _.merge(viteConfig, vite);
}