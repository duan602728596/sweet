import type Config from 'webpack-chain';
import type { SweetConfig } from '../utils/types.js';

/* 图片静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  config
    .module
    .rule('image')
    .test(/^.*\.(jpe?g|png|gif|webp|avifs?|avis)|(?<!component)\.svgz?$/i)
    .merge({
      type: 'asset',
      generator: {
        emit: !sweetConfig.serverRender
      },
      parser: {
        dataUrlCondition: {
          maxSize: 8192
        }
      }
    });
}