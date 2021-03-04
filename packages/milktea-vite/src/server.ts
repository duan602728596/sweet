import * as path from 'path';
import * as _ from 'lodash';
import { basicConfig } from './config/basicConfig';
import type { InlineConfig } from 'vite';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * vite 生产环境SSR编译配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): InlineConfig {
  const { mode, frame, vite, chainVite, serverEntry }: SweetConfig = sweetConfig;
  const basicCfg: InlineConfig = basicConfig(sweetOptions);

  const viteConfig: InlineConfig = _.merge(basicCfg, {
    mode,
    css: {
      modules: {
        generateScopedName: '_[hash:base64:6]'
      }
    },
    build: {
      outDir: path.join(basicCfg.root!, '../dist-server'),
      ssr: serverEntry,
      minify: true,
      sourcemap: true
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