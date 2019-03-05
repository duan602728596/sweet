/* less 配置 */
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import lessConfig from '../config/less';
import cssConfig from '../config/css';
import { SweetConfig, Loader } from '../utils/types';

interface Css {
  publicPath?: string;
  modules?: boolean;
  exclude?: RegExp;
  include?: RegExp;
  modifyVars?: object;
}

export default function(sweetConfig: SweetConfig): Loader {
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

  // style-loader配置
  const miniCssExtractPluginLoader: Object = publicPath ? {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath
    }
  } : MiniCssExtractPlugin.loader;
  const endLoader: Object | string = isDevelopment
    ? (frame === 'vue' ? 'vue-style-loader' : 'style-loader')
    : miniCssExtractPluginLoader;

  // config
  const cssLoaderConfig: Loader = {
    test: /^.*\.(le|c)ss$/,
    exclude,
    include
  };

  // less
  const lessConfig2: Object = lessConfig({ modifyVars });

  // loader配置
  const basicConfig: Array<any> = [
    cssConfig({
      isDevelopment,
      modules,
      isLocals: serverRender
    }),
    lessConfig2
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
      lessConfig2
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