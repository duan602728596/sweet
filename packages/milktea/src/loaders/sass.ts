import * as Config from 'webpack-chain';
import { Rule, LoaderOptions } from 'webpack-chain';
import { createStyleLoader, createCssOptions, createSassOptions } from '../config/cssConfig';
import { SweetConfig, SASS } from '../utils/types';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, sass, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const sassOptions: SASS = sass ?? {};
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

  // style-loader options
  const styleLoaderOptions: LoaderOptions = { esModule: true };

  if (!isDevelopment) {
    styleLoaderOptions.publicPath = publicPath;
  }

  // css-loader
  const sr: boolean = !!serverRender;
  const cssLoaderOptions: LoaderOptions = createCssOptions(modules, isDevelopment, sr, localIdentName, getLocalIdent);
  const ScopedCssLoaderOptions: LoaderOptions = createCssOptions(false, isDevelopment, sr);

  // sass-loader
  // TODO: 未来会移除 data 选项
  const sassLoaderOptions: LoaderOptions = createSassOptions(prependData ?? data, isDevelopment);

  const sassRule: Rule = config
    .module
    .rule('sass');

  // vue
  config
    .when(frame === 'vue',
      (config: Config): void => {
        const oneOf: Rule<Rule> = sassRule
          .oneOf('vue')
          .resourceQuery(/scoped/);

        // vue style
        if (!serverRender) {
          const vueStyleLoader: string | any = createStyleLoader(isDevelopment);

          oneOf
            .use('style-loader')
            .loader(vueStyleLoader)
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
  const oneOf: Rule<Rule> = sassRule
    .oneOf('basic');

  // style
  if (!serverRender) {
    oneOf
      .use('style-loader')
      .loader(createStyleLoader(isDevelopment))
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