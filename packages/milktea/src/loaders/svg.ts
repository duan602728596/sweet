import * as Config from 'webpack-chain';
import { SweetConfig } from '../utils/types';

/* svg文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = isDevelopment ? '[name].[hash:5].[ext]' : '[hash:5].[ext]';

  config
    .module
    .rule('svg')
    .test(/\.svg$/)
    .use('file-loader')
    .loader('file-loader')
    .options( {
      name: filename,
      emitFile: !serverRender
    });
}