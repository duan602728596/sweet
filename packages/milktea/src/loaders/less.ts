import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Rule, OneOf } from 'webpack-chain';
import { createStyleLoader, createCssOptions, createLessOptions } from '../config/cssConfig';
import { SweetConfig, LESS } from '../utils/types';

/* less & css 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * css { Object }: loader里面css的配置
   * frame { string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, css, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const cssOptions: LESS = css || {};
  const { publicPath, modules = true, exclude, include, modifyVars, localIdentName, getLocalIdent }: LESS = cssOptions;

  config
    .merge({
      module: {
        rule: {
          less: {
            test: /^.*\.(le|c)ss$/,
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
  const cssLoaderOptions: object = createCssOptions(modules, isDevelopment, sr, localIdentName, getLocalIdent);
  const ScopedCssLoaderOptions: object = createCssOptions(false, isDevelopment, sr);

  // less-loader
  const lessLoaderOptions: object = createLessOptions(modifyVars, isDevelopment);

  const lessRule: Rule = config
    .module
    .rule('less');

  // vue
  config
    .when(frame === 'vue',
      (config: Config): void => {
        const oneOf: OneOf = lessRule
          .oneOf('vue')
          .resourceQuery(/scoped/);

        // style
        if (!serverRender) {
          oneOf
            .use('style')
            .loader(styleLoader)
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
  const oneOf: OneOf = lessRule
    .oneOf('basic');

  // style
  if (!serverRender) {
    oneOf
      .use('style')
      .loader('style-loader')
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