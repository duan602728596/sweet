import type Config from 'webpack-chain';
import jsLoader from './javascript.js';
import tsLoader from './typescript.js';
import sassLoader from './sass.js';
import lessLoader from './less.js';
import faviconLoader from './favicon.js';
import fontFileLoader from './fontFile.js';
import htmlLoader from './html.js';
import imageLoader from './image.js';
import svgLoader from './svg.js';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/**
 * 添加loaders
 * @param { SweetConfig } sweetConfig - 获取到的外部配置
 * @param { SweetOptions } sweetOptions - 内部挂载的一些配置
 * @param { Config } config - webpack-chain config
 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
  const { frame, mode, javascript }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // javascript
  await jsLoader(sweetConfig, sweetOptions, config);

  // typescript（如果babel配置了typescript属性，则使用babel，而不使用typescript来编译）
  if (!javascript?.typescript) {
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
    .rule('webpack-dll')
    .test(/\.sweet[\\/]dll[\\/]dll\.js/i)
    .merge({
      type: 'asset/resource',
      generator: {
        filename: isDevelopment ? '__[name]_[hash:5]__[ext]' : '__[hash:15]__[ext]',
        emit: !sweetConfig.serverRender
      }
    });
}