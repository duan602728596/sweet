import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { getLocalIdent } from 'css-loader/dist/utils';
import { LoaderOptions } from 'webpack-chain';
import { loader } from 'webpack';
import { Frame } from '../utils/types';

/* css-loader配置 */
// css-loader的getLocalIdent函数
export function cssLoaderGetLocalIdent(
  loaderContext: loader.LoaderContext,
  localIdentName: string,
  localName: string,
  options: { [key: string]: any }
): string {
  // node_modules 和 global文件直接返回className
  if (/(node_modules|global\.(c|le|sa|sc)ss)/i.test(loaderContext.resourcePath)) {
    return localName;
  }

  const className: string = getLocalIdent(loaderContext, localIdentName, localName, options);

  return className;
}

/**
 * style-loader
 * @param { string } frame: 是否为react或vue模式
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createStyleLoader(frame: Frame | undefined, isDevelopment: boolean): string | any {
  return isDevelopment
    ? (frame === 'vue' ? 'vue-style-loader' : 'style-loader')
    : MiniCssExtractPlugin.loader;
}

/**
 * css-loader options
 * @param { boolean } modules: 是否开启css-modules
 * @param { boolean } isDevelopment: 是否为开发环境
 * @param { boolean } serverRender: 是否为服务器端渲染
 * @param { string } localIdentName: localIdentName
 * @param { Function } getLocalIdent: getLocalIdent
 */
export function createCssOptions(
  modules: boolean,
  isDevelopment: boolean,
  serverRender: boolean,
  localIdentName?: string,
  getLocalIdent?: Function
): LoaderOptions {
  return {
    modules: modules ? {
      localIdentName: localIdentName || (isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]'),
      getLocalIdent: getLocalIdent || cssLoaderGetLocalIdent
    } : false,
    onlyLocals: serverRender,
    sourceMap: isDevelopment
  };
}

/**
 * less-loader options
 * @param { object } modifyVars: less变量
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createLessOptions(modifyVars: object | undefined, isDevelopment: boolean): LoaderOptions {
  return {
    javascriptEnabled: true,
    modifyVars,
    sourceMap: isDevelopment
  };
}

/**
 * sass-loader options
 * @param { string | Function | undefined } prependData: sass变量
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createSassOptions(prependData: string | Function | undefined, isDevelopment: boolean): LoaderOptions {
  return {
    outputStyle: isDevelopment ? 'compact' : 'compressed',
    prependData,
    sourceMap: isDevelopment
  };
}