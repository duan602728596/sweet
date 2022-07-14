import webpack from 'webpack';
import type Config from 'webpack-chain';
import { handleDefaultProgress, handleServerRenderProgress } from './handleProgress.js';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/* 生产环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { serverRender, webpackLog }: SweetConfig = sweetConfig;

  // 当环境为测试时，不使用输出插件
  config.when(sweetConfig.frame !== 'test' && webpackLog === 'stats', (chainConfig: Config): void => {
    chainConfig
      .plugin('webpack.ProgressPlugin')
      .use(webpack.ProgressPlugin, [
        serverRender
          ? handleServerRenderProgress
          : handleDefaultProgress
      ]);
  });
}