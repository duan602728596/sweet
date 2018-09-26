/* less 配置 */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import lessConfig from '../config/less';
import cssConfig from '../config/css';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * css { Object }: loader里面css的配置
   * frame { ?string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, css, frame, serverRender }: {
    mode: string,
    css: {
      publicPath: string,
      modules: boolean,
      exclude: ?RegExp,
      include: ?RegExp,
      modifyVars: Object
    },
    frame: ?string,
    serverRender: boolean
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { publicPath, modules = true, exclude, include, modifyVars }: {
    publicPath: string,
    modules: boolean,
    exclude: ?RegExp,
    include: ?RegExp,
    modifyVars: Object
  } = css || {};

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
  const cssLoaderConfig: Object = {
    test: /^.*\.(le|c)ss$/,
    exclude,
    include
  };

  // less
  const lessConfig2: Object = lessConfig({ modifyVars });

  // loader配置
  const basicConfig: [] = [
    cssConfig({
      isDevelopment,
      modules,
      isLocals: serverRender
    }),
    lessConfig2
  ];

  // 服务器端渲染
  if(!serverRender){
    basicConfig.unshift(endLoader);
  }

  // vue
  if(frame === 'vue'){
    const use: [] = [
      cssConfig({
        isDevelopment,
        modules: false,
        isLocals: serverRender
      }),
      lessConfig2
    ];

    // 服务器端渲染
    if(!serverRender){
      use.unshift(endLoader);
    }

    cssLoaderConfig.oneOf = [
      { resourceQuery: /scoped/, use },
      { use: basicConfig }
    ];
  }else{
    cssLoaderConfig.use = basicConfig;
  }

  return cssLoaderConfig;
}