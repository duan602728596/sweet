import * as sass from 'sass';
import * as Fiber from 'fibers';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import type { LoaderOptions } from 'webpack-chain';

// css-loader的mode
// Callback must return "local", "global", or "pure" values
function cssLoaderModeFunc(resourcePath: string): string {
  if (/(pure\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
    return 'pure';
  }

  if (/(node_modules|global\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
    return 'global';
  }

  return 'local';
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
      mode: cssLoaderModeFunc,
      localIdentName: localIdentName ?? (isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]'),
      getLocalIdent
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