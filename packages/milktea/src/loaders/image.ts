import type Config from 'webpack-chain';
import createFileName from '../config/fileNameConfig';
import type { SweetConfig } from '../utils/types';

/* 图片静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  config
    .module
    .rule('image')
    .test(/^.*\.(jpe?g|png|gif|webp|avifs?|avis)|(?<!component)\.svg$/i)
    .merge({
      type: 'asset',
      generator: {
        filename: createFileName(sweetConfig.mode === 'development'),
        emit: !sweetConfig.serverRender
      },
      parser: {
        dataUrlCondition: {
          maxSize: 8192
        }
      }
    });
}