import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Rule, OneOf } from 'webpack-chain';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import cssLoaderGetLocalIdent from '../utils/cssLoaderGetLocalIdent';
import { SweetConfig, Css } from '../utils/types';

/* sass 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * sass { Object }: loader里面sass的配置
   * frame { string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, sass, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const sassOptions: Css = sass || {};
  const { publicPath, modules = true, exclude, include }: Css = sassOptions;

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

  const sassRule: Rule = config.module.rule('sass');

  // style-loader
  const styleLoader: any = isDevelopment
    ? (frame === 'vue' ? 'vue-style-loader' : 'style-loader')
    : MiniCssExtractPlugin.loader;
  const styleLoaderOptions: object = isDevelopment ? {} : { publicPath };

  // css-loader
  const cssLoaderOptions: object = {
    modules: modules ? {
      localIdentName: isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]',
      getLocalIdent: cssLoaderGetLocalIdent
    } : false,
    onlyLocals: serverRender,
    sourceMap: isDevelopment
  };

  // sass-loader
  const sassLoaderOptions: object = {
    outputStyle: isDevelopment ? 'compact' : 'compressed',
    sourceMap: isDevelopment
  };

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
          .options({
            onlyLocals: serverRender,
            sourceMap: isDevelopment
          })
          .end()
          // sass
          .use('sass-loader')
          .loader('sass-loader')
          .options(sassLoaderOptions);
      }
    );

  // basic
  const oneOf: OneOf = sassRule.oneOf('basic');

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
    .options(cssLoaderOptions)
    .end()
    // sass
    .use('sass-loader')
    .loader('sass-loader')
    .options(sassLoaderOptions);
}