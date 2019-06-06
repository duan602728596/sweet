import * as Config from 'webpack-chain';
import { SweetConfig } from '../utils/types';

/* favicon 图标配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  config
    .module
    .rule('favicon')
    .test(/favicon\.ico$/i)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: '[name].[ext]'
    });
}