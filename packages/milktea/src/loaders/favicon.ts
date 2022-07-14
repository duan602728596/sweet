import type Config from 'webpack-chain';
import type { SweetConfig } from '../utils/types.js';

/* favicon 图标配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  config
    .module
    .rule('favicon')
    .test(/favicon\.ico$/i)
    .merge({
      type: 'asset/resource',
      generator: {
        filename: '[name][ext]',
        emit: !sweetConfig.serverRender
      }
    });
}