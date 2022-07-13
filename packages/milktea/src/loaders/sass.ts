import type Config from 'webpack-chain';
import type { Rule, LoaderOptions } from 'webpack-chain';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createCssOptions, createSassOptions } from '../config/cssConfig';
import type { SweetConfig, SassOptions } from '../utils/types';

const RULE_NAME: string = 'sass';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, sass = {}, frame, serverRender }: SweetConfig = sweetConfig;
  const {
    modules = true,
    exclude,
    include,
    additionalData
  }: SassOptions = sass;
  const isDevelopment: boolean = mode === 'development';

  config
    .merge({
      module: {
        rule: {
          [RULE_NAME]: {
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
  const sassRule: Rule = config.module.rule(RULE_NAME);
  const sassLoaderOptions: LoaderOptions = createSassOptions(additionalData, isDevelopment);

  // vue
  config
    .when(frame === 'vue',
      (chainConfig: Config): void => {
        const sassRuleOneOf: Rule<Rule> = sassRule
          .oneOf('vue')
          .resourceQuery(/scoped/);

        // vue style
        if (!serverRender) {
          sassRuleOneOf
            .use('mini-css-extract-plugin/loader')
            .loader(MiniCssExtractPlugin.loader);
        }

        sassRuleOneOf
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
  const oneOf: Rule<Rule> = sassRule.oneOf('basic');

  // style
  if (!serverRender) {
    oneOf
      .use('mini-css-extract-plugin/loader')
      .loader(MiniCssExtractPlugin.loader);
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