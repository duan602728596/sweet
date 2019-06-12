import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Rule, OneOf } from 'webpack-chain';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { RuleSetCondition } from 'webpack';
import { SweetConfig } from '../utils/types';

interface Css {
  publicPath?: string;
  modules?: boolean;
  exclude?: RuleSetCondition;
  include?: RuleSetCondition;
  modifyVars?: object;
}

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
  const _css: Css = css || {};
  const { publicPath, modules = true, exclude, include, modifyVars }: Css = _css;

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

  const lessRule: Rule = config.module.rule('less');

  // style-loader
  const styleLoader: any = isDevelopment
    ? (frame === 'vue' ? 'vue-style-loader' : 'style-loader')
    : MiniCssExtractPlugin.loader;
  const styleLoaderOptions: object = isDevelopment ? {} : { publicPath };

  // css-loader
  const cssLoaderOptions: object = {
    modules: modules ? {
      localIdentName: isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]'
    } : false,
    onlyLocals: serverRender,
    sourceMap: isDevelopment
  };

  // less-loader
  const lessLoaderOptions: object = {
    javascriptEnabled: true,
    modifyVars,
    sourceMap: isDevelopment
  };

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
          .options({
            onlyLocals: serverRender,
            sourceMap: isDevelopment
          })
          .end()
          // less
          .use('less')
          .loader('less-loader')
          .options(lessLoaderOptions);
      }
    );

  // basic
  const oneOf: OneOf = lessRule.oneOf('basic');

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
    .options(cssLoaderOptions)
    .end()
    // less
    .use('less')
    .loader('less-loader')
    .options(lessLoaderOptions);
}