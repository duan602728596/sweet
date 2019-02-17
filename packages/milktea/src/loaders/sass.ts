/* sass 配置 */
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import sassConfig from '../config/sass';
import cssConfig from '../config/css';
import { SweetConfig, Loader } from '../utils/types';

interface Sass {
  publicPath?: string;
  modules?: boolean;
  exclude?: RegExp;
  include?: RegExp;
  modifyVars?: object;
}

export default function(sweetConfig: SweetConfig): Loader {
  /**
   * mode { string }: 开发模式还是生产模式
   * sass { Object }: loader里面sass的配置
   * frame { ?string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, sass, frame, serverRender }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const _sass: Sass = sass || {};
  const { publicPath, modules = true, exclude, include }: Sass = _sass;

  // style-loader配置
  const miniCssExtractPluginLoader: object = publicPath ? {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath
    }
  } : MiniCssExtractPlugin.loader;
  const endLoader: object | string = isDevelopment
    ? (frame === 'vue' ? 'vue-style-loader' : 'style-loader')
    : miniCssExtractPluginLoader;

  // config
  const cssLoaderConfig: Loader = {
    test: /^.*\.s(a|c)ss$/,
    exclude,
    include
  };

  // sass
  const sassConfig2: object = sassConfig({ isDevelopment });

  // loader配置
  const basicConfig: Array<any> = [
    cssConfig({
      isDevelopment,
      modules,
      isLocals: serverRender
    }),
    sassConfig2
  ];

  // 服务器端渲染
  if (!serverRender) {
    basicConfig.unshift(endLoader);
  }

  // vue
  if (frame === 'vue') {
    const use: Array<any> = [
      cssConfig({
        isDevelopment,
        modules: false,
        isLocals: serverRender
      }),
      sassConfig2
    ];

    // 服务器端渲染
    if (!serverRender) {
      use.unshift(endLoader);
    }

    cssLoaderConfig.oneOf = [
      {
        resourceQuery: /scoped/,
        use
      },
      {
        use: basicConfig
      }
    ];
  } else {
    cssLoaderConfig.use = basicConfig;
  }

  return cssLoaderConfig;
}