import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Rule, OneOf } from 'webpack-chain';
import { createStyleLoader, createCssOptions, createSassOptions } from '../config/cssConfig';
import { SweetConfig, CSS } from '../utils/types';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Config, typescript: boolean): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * sass { Object }: loader里面sass的配置
   * frame { string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, sass, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const sassOptions: CSS = sass || {};
  const { publicPath, modules = true, exclude, include }: CSS = sassOptions;

  config
    .merge({
      module: {
        rule: {
          sass: {
            test: /^.*\.s(a|c)ss$/,
            exclude: exclude ? (_.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (_.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  // style-loader
  const styleLoader: string | any = createStyleLoader(frame, isDevelopment);
  const styleLoaderOptions: object = isDevelopment ? {} : { publicPath };

  // css-loader
  const sr: boolean = !!serverRender;
  const cssLoaderOptions: object = createCssOptions(modules, isDevelopment, sr);
  const ScopedCssLoaderOptions: object = createCssOptions(false, isDevelopment, sr);
  const cssLoader: string = typescript ? 'typings-for-css-modules-loader' : 'css-loader';

  if (typescript) {
    Object.assign(cssLoaderOptions, {
      namedExport: true,
      camelCase: true
    });
  }

  // sass-loader
  const sassLoaderOptions: object = createSassOptions(isDevelopment);

  const sassRule: Rule = config
    .module
    .rule(typescript ? 'sass-typescript' : 'sass');

  // vue
  config
    .when(frame === 'vue',
      (config: Config): void => {
        const oneOf: OneOf = sassRule
          .oneOf('vue')
          .resourceQuery(/scoped/);

        // style
        if (!serverRender) {
          oneOf
            .use('style-loader')
            .loader(styleLoader)
            .options(styleLoaderOptions);
        }

        oneOf
          // css
          .use('css-loader')
          .loader(cssLoader)
          .options(ScopedCssLoaderOptions)
          .end()
          // sass
          .use('sass-loader')
          .loader('sass-loader')
          .options(sassLoaderOptions);
      }
    );

  // basic
  const oneOf: OneOf = sassRule
    .oneOf('basic');

  // style
  if (!serverRender) {
    oneOf
      .use('style-loader')
      .loader(styleLoader)
      .options(styleLoaderOptions);
  }

  oneOf
    // css
    .use('css-loader')
    .loader(cssLoader)
    .options(cssLoaderOptions)
    .end()
    // sass
    .use('sass-loader')
    .loader('sass-loader')
    .options(sassLoaderOptions);

  // issuer
  if (typescript) {
    config
      .when(frame === 'react' || frame === 'vue',
        (config: Config): void => {
          config
            .merge({
              module: {
                rule: {
                  'sass-typescript': { issuer: /^.*\.(tsx?|vue)$/ }
                }
              }
            });
        }
      );
  }
}