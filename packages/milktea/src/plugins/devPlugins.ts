import * as path from 'node:path';
import webpack, { type Configuration } from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import { moduleExists, requireJson } from '@sweet-milktea/utils';
import CacheConfig from '../config/cacheConfig.js';
import { configPluginPush } from '../utils/utils.js';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/* 开发环境插件 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration): Promise<void> {
  const { dll, serverRender, frame, hot }: SweetConfig = sweetConfig;

  // dll
  if (dll && Array.isArray(dll) && dll.length > 0 && !serverRender) {
    configPluginPush(config, new webpack.DllReferencePlugin({
      manifest: await requireJson(path.join(sweetOptions.basicPath, CacheConfig.Dll, 'manifest.json'))
    }));
  }

  // 热替换 webpack5的HotModuleReplacementPlugin插件会生成无用的文件
  if (hot) {
    configPluginPush(config, new webpack.HotModuleReplacementPlugin());
  }

  // react-refresh-webpack-plugin
  if (hot && frame === 'react') {
    configPluginPush(config, new ReactRefreshWebpackPlugin({
      overlay: {
        sockIntegration: false
      }
    }));
  }
}