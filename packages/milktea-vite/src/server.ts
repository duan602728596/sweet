import * as path from 'node:path';
import _ from 'lodash';
// @ts-ignore Node16
import type { InlineConfig } from 'vite';
import { basicConfig } from './config/basicConfig';
import addJsxPlugins from './config/addJsxPlugins';
import { addTsChecker } from './utils/tsChecker';
import { changeSweetConfig, customizer } from './utils/utils';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * vite 生产环境SSR编译配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<InlineConfig> {
  changeSweetConfig(sweetConfig);

  const { mode, frame, vite, chainVite, serverEntry, ts }: SweetConfig = sweetConfig;
  const viteConfig: InlineConfig = _.merge(basicConfig(sweetOptions), {
    mode,
    css: {
      modules: {
        generateScopedName: '_[hash:base64:6]'
      }
    },
    build: {
      outDir: path.join(sweetOptions.basicPath, 'dist-server'),
      ssr: serverEntry,
      minify: true,
      sourcemap: true
    },
    ssr: {
      format: 'cjs'
    }
  });

  // 添加jsx插件
  await addJsxPlugins(viteConfig, frame);

  // 添加typescript的检查插件
  await addTsChecker(sweetOptions, viteConfig, frame, ts);

  if (chainVite) {
    await chainVite(viteConfig);
  }

  return _.mergeWith(viteConfig, vite, customizer);
}