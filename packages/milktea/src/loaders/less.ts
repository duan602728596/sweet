import * as Config from 'webpack-chain';
import type { Rule, LoaderOptions } from 'webpack-chain';
import { createStyleLoader, createCssOptions, createLessOptions } from '../config/cssConfig';
import type { SweetConfig, LESS } from '../utils/types';

/* less & css 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, css, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const cssOptions: LESS = css ?? {};
  const { publicPath, modules = true, exclude, include, modifyVars, localIdentName, getLocalIdent }: LESS = cssOptions;

  config
    .merge({
      module: {
        rule: {
          less: {
            test: /^.*\.(le|c)ss$/,
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

  // less-loader
  const lessLoaderOptions: LoaderOptions = createLessOptions(modifyVars, isDevelopment);

  const lessRule: Rule = config
    .module
    .rule('less');

  // vue
  config
    .when(frame === 'vue',
      (config: Config): void => {
        const oneOf: Rule<Rule> = lessRule
          .oneOf('vue')
          .resourceQuery(/scoped/);

        // vue style
        if (!serverRender) {
          const vueStyleLoader: string | any = createStyleLoader(isDevelopment);

          oneOf
            .use('style')
            .loader(vueStyleLoader)
            .options(styleLoaderOptions);
        }

        oneOf
          // css
          .use('css')
          .loader('css-loader')
          .options(ScopedCssLoaderOptions)
          .end()
          // less
          .use('less')
          .loader('less-loader')
          .options(lessLoaderOptions);
      }
    );

  // basic
  const oneOf: Rule<Rule> = lessRule
    .oneOf('basic');

  // style
  if (!serverRender) {
    oneOf
      .use('style')
      .loader(createStyleLoader(isDevelopment))
      .options(styleLoaderOptions);
  }

  oneOf
    // css
    .use('css')
    .loader('css-loader')
    .options(cssLoaderOptions)
    .end()
    // less
    .use('less')
    .loader('less-loader')
    .options(lessLoaderOptions);
}