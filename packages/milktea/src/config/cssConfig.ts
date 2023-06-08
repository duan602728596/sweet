import type Sass from 'sass';
import { requireCommonjsModule } from '@sweet-milktea/utils';
import type { LoaderOptions } from 'webpack-chain';

const sass: typeof Sass = requireCommonjsModule('sass');

// css-loader的mode
// Callback must return "local", "global", or "pure" values
function cssLoaderModeFunc(resourcePath: string): 'local' | 'global' | 'pure' {
  if (/(pure\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
    return 'pure';
  }

  if (/(node_modules|global\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
    return 'global';
  }

  return 'local';
}

/**
 * css-loader options
 * @param { boolean } modules: 是否开启css-modules
 * @param { boolean } isDevelopment: 是否为开发环境
 * @param { boolean } serverRender: 是否为服务器端渲染
 */
export function createCssOptions(modules: boolean, isDevelopment: boolean, serverRender: boolean): LoaderOptions {
  const modulesOptions: LoaderOptions = { exportOnlyLocals: serverRender };

  if (modules) {
    Object.assign(modulesOptions, {
      mode: cssLoaderModeFunc,
      localIdentName: isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]'
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
    sassOptions: {
      fiber: false
    },
    additionalData,
    implementation: sass
  };
}