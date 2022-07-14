import type Config from 'webpack-chain';
import type { Rule, LoaderOptions } from 'webpack-chain';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createCssOptions, createLessOptions } from '../config/cssConfig.js';
import type { SweetConfig, LessOptions } from '../utils/types.js';

const RULE_NAME: string = 'less';

/* less & css 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { mode, less = {}, frame, serverRender }: SweetConfig = sweetConfig;
  const {
    modules = true,
    exclude,
    include,
    modifyVars,
    additionalData
  }: LessOptions = less;
  const isDevelopment: boolean = mode === 'development';

  config
    .merge({
      module: {
        rule: {
          [RULE_NAME]: {
            test: /^.*\.(le|c)ss$/i,
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

  // less-loader
  const lessRule: Rule = config.module.rule(RULE_NAME);
  const lessLoaderOptions: LoaderOptions = createLessOptions(modifyVars, additionalData, isDevelopment);

  // vue
  config
    .when(frame === 'vue',
      (chainConfig: Config): void => {
        const lessRuleOneOf: Rule<Rule> = lessRule
          .oneOf('vue')
          .resourceQuery(/scoped/);

        // vue style
        if (!serverRender) {
          lessRuleOneOf
            .use('mini-css-extract-plugin/loader')
            .loader(MiniCssExtractPlugin.loader);
        }

        lessRuleOneOf
          // css
          .use('css-loader')
          .loader('css-loader')
          .options(ScopedCssLoaderOptions)
          .end()
          // less
          .use('less-loader')
          .loader('less-loader')
          .options(lessLoaderOptions);
      }
    );

  // basic
  const oneOf: Rule<Rule> = lessRule.oneOf('basic');

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
    // less
    .use('less-loader')
    .loader('less-loader')
    .options(lessLoaderOptions);
}