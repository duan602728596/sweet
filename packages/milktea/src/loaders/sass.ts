import * as Config from 'webpack-chain';
import type { Rule, LoaderOptions } from 'webpack-chain';
import { createStyleLoader, createCssOptions, createSassOptions } from '../config/cssConfig';
import type { SweetConfig, SASS } from '../utils/types';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, sass = {}, frame, serverRender }: SweetConfig = sweetConfig;
  const {
    modules = true,
    exclude,
    include,
    additionalData
  }: SASS = sass;
  const isDevelopment: boolean = mode === 'development';

  config
    .merge({
      module: {
        rule: {
          sass: {
            test: /^.*\.s(a|c)ss$/i,
            exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (Array.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  // css-loader
  const ssr: boolean = !!serverRender;
  const cssLoaderOptions: LoaderOptions = createCssOptions(modules, isDevelopment, ssr);
  const ScopedCssLoaderOptions: LoaderOptions = createCssOptions(false, isDevelopment, ssr);

  // sass-loader
  const sassLoaderOptions: LoaderOptions = createSassOptions(additionalData, isDevelopment);

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
            .loader(vueStyleLoader);
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
      .loader(createStyleLoader(isDevelopment));
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