import * as Config from 'webpack-chain';
import { SweetConfig } from '../utils/types';

/* 图片静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const mode: string | undefined = sweetConfig.mode;
  const serverRender: boolean | undefined = sweetConfig.serverRender;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = isDevelopment ? '[name]_[hash:5].[ext]' : '[hash:15].[ext]';

  config
    .module
    .rule('image')
    .test(/^.*\.(jpe?g|png|gif|webp)$/)
    .use('url-loader')
    .loader('url-loader')
    .options({
      limit: 8192,
      fallback: {
        loader: 'file-loader',
        options: {
          name: filename,
          emitFile: !serverRender
        }
      }
    });
}