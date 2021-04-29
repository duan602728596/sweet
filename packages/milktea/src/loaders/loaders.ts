import type Config from 'webpack-chain';
import jsLoader from './javascript';
import tsLoader from './typescript';
import sassLoader from './sass';
import lessLoader from './less';
import faviconLoader from './favicon';
import fontFileLoader from './fontFile';
import htmlLoader from './html';
import imageLoader from './image';
import svgLoader from './svg';
import type { SweetConfig, SweetOptions } from '../utils/types';

/**
 * 添加loaders
 * @param { SweetConfig } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 * @param { Config } config: webpack-chain config
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
  const { frame, mode, js }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // js
  await jsLoader(sweetConfig, sweetOptions, config);

  // ts（如果babel配置了typescript属性，则使用babel，而不使用typescript来编译）
  if (!js?.typescript) {
    tsLoader(sweetConfig, sweetOptions, config);
  }

  // sass
  sassLoader(sweetConfig, config);

  // css
  lessLoader(sweetConfig, config);

  // favicon
  faviconLoader(sweetConfig, config);

  // fontFile
  fontFileLoader(sweetConfig, config);

  // html
  htmlLoader(sweetConfig, config);

  // svg
  svgLoader(sweetConfig, config);

  // image
  imageLoader(sweetConfig, config);

  // vue
  config
    .when(frame === 'vue', (chainConfig: Config): void => {
      chainConfig
        .module
        .rule('vue')
        .test(/^.*\.vue$/i)
        .use('vue-loader')
        .loader('vue-loader');
    });

  // 加载dll文件
  config
    .module
    .rule('dll')
    .test(/\.sweet[\\/]dll[\\/]dll\.js/i)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: isDevelopment ? '[name]_[hash:5].[ext]' : '[hash:15].[ext]',
      outputPath: 'dll/'
    });
}