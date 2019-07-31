import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import jsLoader from './javascript';
import tsLoader from './typescript';
import sassLoader from './sass';
import lessLoader from './less';
import faviconLoader from './favicon';
import fontFileLoader from './fontFile';
import htmlLoader from './html';
import imageLoader from './image';
import svgLoader from './svg';
import { formatLoader } from '../utils/utils';
import { SweetConfig, SweetOptions, Loaders } from '../utils/types';

/* loaders */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * loaders { object }: 覆盖默认规则
   * frame { string }: 是否为react或vue模式
   */
  const frame: string | undefined = sweetConfig.frame;
  const loaders: Loaders = sweetConfig.loaders && _.isPlainObject(sweetConfig.loaders) ? sweetConfig.loaders : {};
  const isDevelopment: boolean = sweetConfig.mode === 'development';

  // js
  config
    .when(
      !!loaders.js,
      (config: Config): void => {
        config
          .module
          .rule('js')
          .merge(formatLoader(loaders.js));
      },
      (config: Config): void => {
        // js loader
        jsLoader(sweetConfig, sweetOptions, config);
      });

  config
    .when(
      !!loaders.ts,
      (config: Config): void => {
        config
          .module
          .rule('ts')
          .merge(formatLoader(loaders.ts));
      },
      (config: Config): void => {
        // ts loader
        tsLoader(sweetConfig, sweetOptions, config);
      });

  // sass
  config
    .when(
      !!loaders.sass,
      (config: Config): void => {
        config
          .module
          .rule('sass')
          .merge(formatLoader(loaders.sass));
      },
      (config: Config): void => {
        sassLoader(sweetConfig, config);
      });

  // css
  config
    .when(
      !!loaders.css,
      (config: Config): void => {
        config
          .module
          .rule('css')
          .merge(formatLoader(loaders.css));
      },
      (config: Config): void => {
        lessLoader(sweetConfig, config);
      });

  // favicon
  config
    .when(
      !!loaders.favicon,
      (config: Config): void => {
        config
          .module
          .rule('favicon')
          .merge(formatLoader(loaders.favicon));
      },
      (config: Config): void => {
        faviconLoader(sweetConfig, config);
      });

  // fontFile
  config
    .when(
      !!loaders.fontFile,
      (config: Config): void => {
        config
          .module
          .rule('fontFile')
          .merge(formatLoader(loaders.fontFile));
      },
      (config: Config): void => {
        fontFileLoader(sweetConfig, config);
      });

  // html
  config
    .when(
      !!loaders.html,
      (config: Config): void => {
        config
          .module
          .rule('html')
          .merge(formatLoader(loaders.html));
      },
      (config: Config): void => {
        htmlLoader(sweetConfig, config);
      });

  // svg
  config
    .when(
      !!loaders.svg,
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .merge(formatLoader(loaders.svg));
      },
      (config: Config): void => {
        svgLoader(sweetConfig, config);
      });

  // image
  config
    .when(
      !!loaders.image,
      (config: Config): void => {
        config
          .module
          .rule('image')
          .merge(formatLoader(loaders.image));
      },
      (config: Config): void => {
        imageLoader(sweetConfig, config);
      });

  // vue
  config
    .when(frame === 'vue', (config: Config): void => {
      config
        .module
        .rule('vue')
        .test(/^.*\.vue$/)
        .use('vue-loader')
        .loader('vue-loader');
    });

  // 加载dll文件
  config
    .module
    .rule('dll')
    .test(/\.sweet[\\/]dll[\\/]dll\.js/)
    .use('file-loader')
    .loader('file-loader')
    .options({
      name: isDevelopment ? '[name]_[hash:5].[ext]' : '[hash:15].[ext]',
      outputPath: 'dll/'
    });
}