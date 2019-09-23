import * as Config from 'webpack-chain';
import { Rule, OneOf } from 'webpack-chain';
import { createStyleLoader, createCssOptions, createSassOptions } from '../config/cssConfig';
import { SweetConfig, SASS } from '../utils/types';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, sass, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const sassOptions: SASS = sass || {};
  const { publicPath, modules = true, exclude, include, prependData, data, localIdentName, getLocalIdent }: SASS = sassOptions;

  config
    .merge({
      module: {
        rule: {
          sass: {
            test: /^.*\.s(a|c)ss$/,
            exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (Array.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  // style-loader
  const styleLoader: string | any = createStyleLoader(frame, isDevelopment);
  const styleLoaderOptions: object = isDevelopment ? {} : { publicPath };

  // css-loader
  const sr: boolean = !!serverRender;
  const cssLoaderOptions: object = createCssOptions(modules, isDevelopment, sr, localIdentName, getLocalIdent);
  const ScopedCssLoaderOptions: object = createCssOptions(false, isDevelopment, sr);

  // sass-loader
  // TODO: 未来会移除 data 选项
  const sassLoaderOptions: object = createSassOptions(prependData || data, isDevelopment);

  const sassRule: Rule = config
    .module
    .rule('sass');

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
          .loader('css-loader')
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
      .loader(createStyleLoader(undefined, isDevelopment))
      .options(styleLoaderOptions);
  }

  oneOf
    // css
    .use('css-loader')
    .loader('css-loader')
    .options(cssLoaderOptions)
    .end()
    // sass
    .use('sass-loader')
    .loader('sass-loader')
    .options(sassLoaderOptions);
}