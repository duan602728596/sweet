import * as path from 'path';
import _ from 'lodash';
import type { InlineConfig } from 'vite';
import { basicConfig } from './config/basicConfig';
import addJsxPlugins from './config/addJsxPlugins';
import { addTsChecker } from './utils/tsChecker';
import { changeSweetConfig } from './utils/utils';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * vite 生产环境编译配置
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Promise<InlineConfig> {
  changeSweetConfig(sweetConfig);

  const { mode, frame, vite, chainVite, ts }: SweetConfig = sweetConfig;
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

  // 添加jsx插件
  await addJsxPlugins(viteConfig, frame);

  // 添加typescript的检查插件
  await addTsChecker(sweetOptions, viteConfig, frame, ts);

  if (chainVite) {
    await chainVite(viteConfig);
  }

  return _.merge(viteConfig, vite);
}