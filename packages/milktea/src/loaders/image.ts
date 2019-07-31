import * as Config from 'webpack-chain';
import { createImageConfig } from '../config/imageConfig';
import { SweetConfig } from '../utils/types';

/* 图片静态文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  config
    .module
    .rule('image')
    .test(/^.*\.(jpe?g|png|gif|webp|svg)$/)
    .use('url-loader')
    .loader('url-loader')
    .options(createImageConfig(sweetConfig));
}