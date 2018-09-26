/* sass 配置 */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import sassConfig from '../config/sass';
import cssConfig from '../config/css';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * sass { Object }: loader里面sass的配置
   * frame { ?string }: 是否为react或vue模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, sass, frame, serverRender }: {
    mode: string,
    sass: {
      publicPath: string,
      modules: boolean,
      exclude: ?RegExp,
      include: ?RegExp
    },
    frame: ?string,
    serverRender: boolean
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { publicPath, modules = true, exclude, include }: {
    publicPath: string,
    modules: boolean,
    exclude: ?RegExp,
    include: ?RegExp
  } = sass || {};

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
    test: /^.*\.s(a|c)ss$/,
    exclude,
    include
  };

  // sass
  const sassConfig2: Object = sassConfig({ isDevelopment });

  // loader配置
  const basicConfig: [] = [
    cssConfig({
      isDevelopment,
      modules,
      isLocals: serverRender
    }),
    sassConfig2
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
      sassConfig2
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