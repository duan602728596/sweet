import type Config from 'webpack-chain';
import createFileName from '../config/fileNameConfig';
import type { SweetConfig } from '../utils/types';

/* 字体静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = createFileName(isDevelopment);

  config
    .module
    .rule('fontFile')
    .test(/^.*\.(eot|ttf|woff2?)$/i)
    .use('file-loader')
    .loader('file-loader')
    .options( {
      name: filename,
      emitFile: !serverRender
    });
}