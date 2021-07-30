import { merge } from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { InlineConfig } from 'vite';
import { basicConfig } from './config/basicConfig';
import { addTsChecker } from './utils/tsChecker';
import { changeSweetConfig } from './utils/utils';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * vite 配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<InlineConfig> {
  changeSweetConfig(sweetConfig);

  const { mode, frame, vite, chainVite, ts }: SweetConfig = sweetConfig;
  const viteConfig: InlineConfig = merge(basicConfig(sweetOptions), {
    mode,
    css: {
      modules: {
        generateScopedName: '[path][name]__[local]___[hash:base64:6]'
      }
    },
    server: {
      middlewareMode: true
    }
  });

  if (frame === 'react') {
    // 添加react配置
    Object.assign(viteConfig, {
      esbuild: {
        jsxFactory: 'React.createElement',
        jsxFragment: 'React.Fragment',
        jsxInject: "import * as React from 'react';"
      },
      plugins: [(await requireModule('@vitejs/plugin-react-refresh'))()]
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

  // 添加typescript的检查插件
  await addTsChecker(sweetOptions, viteConfig, frame, ts);

  if (chainVite) {
    await chainVite(viteConfig);
  }

  return merge(viteConfig, vite);
}