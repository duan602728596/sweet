import * as path from 'path';
import * as webpack from 'webpack';
import * as ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import type * as Config from 'webpack-chain';
import { requireModule, moduleExists } from '../utils/utils';
import { dllCache } from '../config/cacheConfig';
import type { SweetConfig, SweetOptions } from '../utils/types';

/* 开发环境插件 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
  const { dll, serverRender, frame, hot, hotType = 'react-refresh' }: SweetConfig = sweetConfig;

  // dll
  const isDll: boolean = !!(dll && Array.isArray(dll) && dll.length > 0 && !serverRender);

  if (isDll) {
    config
      .plugin('DllReferencePlugin')
      .use(webpack.DllReferencePlugin, [{
        context: sweetOptions.basicPath,
        manifest: await requireModule(path.join(sweetOptions.basicPath, dllCache, 'manifest.json'))
      }]);
  }

  // 热替换 webpack5的HotModuleReplacementPlugin插件会生成无用的文件
  config
    .when(!!hot, (chainConfig: Config): void => {
      chainConfig
        .plugin('webpack.HotModuleReplacementPlugin')
        .use(webpack.HotModuleReplacementPlugin);
    });

  // react-refresh-webpack-plugin
  const isReactRefresh: boolean = !!hot && frame === 'react' && hotType === 'react-refresh';

  if (isReactRefresh) {
    config
      .plugin('react-refresh-webpack-plugin')
      .use(ReactRefreshWebpackPlugin, [{
        overlay: {
          entry: moduleExists('@pmmmwh/react-refresh-webpack-plugin/client/ErrorOverlayEntry'),
          module: moduleExists('@pmmmwh/react-refresh-webpack-plugin/overlay')
        }
      }]);
  }
}