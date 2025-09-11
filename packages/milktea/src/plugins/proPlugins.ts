import webpack, { type Configuration } from 'webpack';
import { handleDefaultProgress, handleServerRenderProgress } from './handleProgress.js';
import { configPluginPush } from '../utils/utils.js';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/* 生产环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration): void {
  const { serverRender, webpackLog }: SweetConfig = sweetConfig;

  // 当环境为测试时，不使用输出插件
  if (sweetConfig.frame !== 'test' && webpackLog === 'stats') {
    configPluginPush(config, new webpack.ProgressPlugin(serverRender ? handleServerRenderProgress : handleDefaultProgress));
  }
}