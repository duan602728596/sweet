import * as sass from 'sass';

const enum CssLoaderMode {
  Local = 'local',
  Global = 'global',
  Pure = 'pure'
}

/**
 * css-loader global mode
 * @param { CssLoaderMode } defaultMode
 * @return { (resourcePath: string) => CssLoaderMode }
 */
function createCssLoaderModeFunc(defaultMode: CssLoaderMode): (resourcePath: string) => CssLoaderMode {
  /**
   * @param { string } resourcePath
   * @return { CssLoaderMode }
   */
  return function(resourcePath: string): CssLoaderMode {
    if (/(pure\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
      return CssLoaderMode.Pure;
    }

    if (/(module\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
      return CssLoaderMode.Local;
    }

    if (/(node_modules|global\.(css|less|sass|scss|styl(us)?))/i.test(resourcePath)) {
      return CssLoaderMode.Global;
    }

    return defaultMode;
  };
}

/**
 * css-loader options
 * @param { boolean } modules - 是否开启css-modules
 * @param { boolean } isDevelopment - 是否为开发环境
 * @param { boolean } serverRender - 是否为服务器端渲染
 */
export function createCssOptions(modules: boolean, isDevelopment: boolean, serverRender: boolean): Record<string, any> {
  return {
    modules: {
      exportOnlyLocals: serverRender,
      localIdentName: isDevelopment ? '[path][name]__[local]___[hash:base64:6]' : '_[hash:base64:6]',
      namedExport: false,
      mode: createCssLoaderModeFunc(modules ? CssLoaderMode.Local : CssLoaderMode.Global)
    }
  };
}

/**
 * less-loader options
 * @param { object } modifyVars - less变量
 * @param { string | Function } additionalData
 */
export function createLessOptions(modifyVars: object | undefined, additionalData: string | Function | undefined): Record<string, any> {
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
 * @param { string | Function } additionalData - sass变量
 */
export function createSassOptions(additionalData: string | Function | undefined): Record<string, any> {
  return {
    sassOptions: {},
    additionalData,
    implementation: sass
  };
}