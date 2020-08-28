import * as path from 'path';
import * as sass from 'sass';
import * as Fiber from 'fibers';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as normalizePath from 'normalize-path';
import * as cssesc from 'cssesc';
import * as loaderUtils from 'loader-utils';
import { loader } from 'webpack';
import type { LoaderOptions } from 'webpack-chain';

/**
 * TODO: css-loader的getLocalIdent函数，无法导出模块
 * https://github.com/webpack-contrib/css-loader/blob/master/src/utils.js#L49
 */
const filenameReservedRegex: RegExp = /[<>:"/\\|?*\x00-\x1F]/g,
  reControlChars: RegExp = /[\u0000-\u001f\u0080-\u009f]/g,
  reRelativePath: RegExp = /^\.+/;

export function cssLoaderGetLocalIdentFunc(
  loaderContext: loader.LoaderContext,
  localIdentName: string,
  localName: string,
  options: any
): string {
  const { context, hashPrefix }: any = options;
  const { resourcePath }: loader.LoaderContext = loaderContext;
  const request: string = normalizePath(path.relative(context, resourcePath));

  options.content = `${ hashPrefix + request }\x00${ unescape(localName) }`;

  // Using `[path]` placeholder outputs `/` we need escape their
  // Also directories can contains invalid characters for css we need escape their too
  return cssesc(
    loaderUtils
      .interpolateName(loaderContext, localIdentName, options)
      // For `[hash]` placeholder
      .replace(/^((-?[0-9])|--)/, '_$1')
      .replace(filenameReservedRegex, '-')
      .replace(reControlChars, '-')
      .replace(reRelativePath, '-')
      .replace(/\./g, '-'),
    { isIdentifier: true }
  ).replace(/\\\[local\\\]/gi, localName);
}

/* css-loader配置 */
// css-loader的getLocalIdent函数
export function cssLoaderGetLocalIdent(
  loaderContext: loader.LoaderContext,
  localIdentName: string,
  localName: string,
  options: any
): string {
  // node_modules 和 global文件直接返回className
  if (/(node_modules|global\.(css|less|sass|scss|styl(us)?))/i.test(loaderContext.resourcePath)) {
    return localName;
  }

  const className: string = cssLoaderGetLocalIdentFunc(loaderContext, localIdentName, localName, options);

  return className;
}

/**
 * style-loader
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createStyleLoader(isDevelopment: boolean): string | any {
  return isDevelopment
    ? 'style-loader'
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
  const modulesOptions: LoaderOptions = { exportOnlyLocals: serverRender };

  if (modules) {
    Object.assign(modulesOptions, {
      localIdentName: localIdentName ?? (isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]'),
      getLocalIdent: getLocalIdent ?? cssLoaderGetLocalIdent
    });
  }

  return { modules: modulesOptions };
}

/**
 * less-loader options
 * @param { object } modifyVars: less变量
 * @param { string | Function } additionalData
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createLessOptions(
  modifyVars: object | undefined,
  additionalData: string | Function | undefined,
  isDevelopment: boolean
): LoaderOptions {
  return {
    lessOptions: {
      javascriptEnabled: true,
      modifyVars
    },
    additionalData
  };
}

/**
 * sass-loader options
 * @param { string | Function } additionalData: sass变量
 * @param { boolean } isDevelopment: 是否为开发环境
 */
export function createSassOptions(additionalData: string | Function | undefined, isDevelopment: boolean): LoaderOptions {
  return {
    sassOptions: { fiber: Fiber },
    additionalData,
    implementation: sass
  };
}