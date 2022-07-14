import * as path from 'node:path';
import webpack from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type Config from 'webpack-chain';
import { moduleExists, requireJson } from '@sweet-milktea/utils';
import CacheConfig from '../config/cacheConfig';
import type { SweetConfig, SweetOptions } from '../utils/types';

/* 开发环境插件 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
  const { dll, serverRender, frame, hot }: SweetConfig = sweetConfig;

  // dll
  if (dll && Array.isArray(dll) && dll.length > 0 && !serverRender) {
    config
      .plugin('webpack.DllReferencePlugin')
      .use(webpack.DllReferencePlugin, [{
        manifest: await requireJson(path.join(sweetOptions.basicPath, CacheConfig.Dll, 'manifest.json'))
      }]);
  }

  // 热替换 webpack5的HotModuleReplacementPlugin插件会生成无用的文件
  config.when(!!hot, (chainConfig: Config): void => {
    chainConfig
      .plugin('webpack.HotModuleReplacementPlugin')
      .use(webpack.HotModuleReplacementPlugin);
  });

  // react-refresh-webpack-plugin
  config.when(!!hot && frame === 'react', (chainConfig: Config): void => {
    chainConfig
      .plugin('react-refresh-webpack-plugin')
      .use(ReactRefreshWebpackPlugin, [{
        overlay: {
          entry: moduleExists('@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry'),
          module: moduleExists('@pmmmwh/react-refresh-webpack-plugin/overlay')
        }
      }]);
  });
}