import * as Config from 'webpack-chain';
import { createFileName } from '../config/fileNameConfig';
import { SweetConfig } from '../utils/types';

/* 字体静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = createFileName(isDevelopment);

  config
    .module
    .rule('fontFile')
    .test(/^.*\.(eot|ttf|woff2?)$/)
    .use('file-loader')
    .loader('file-loader')
    .options( {
      name: filename,
      emitFile: !serverRender
    });
}