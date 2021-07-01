import type Config from 'webpack-chain';
import createFileName from '../config/fileNameConfig';
import type { SweetConfig } from '../utils/types';

/* 字体静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  config
    .module
    .rule('fontFile')
    .test(/^.*\.(eot|ttf|woff2?)$/i)
    .merge({
      type: 'asset/resource',
      generator: {
        filename: createFileName(sweetConfig.mode === 'development'),
        emit: !sweetConfig.serverRender
      }
    });
}