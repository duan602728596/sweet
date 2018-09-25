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
      outputPath: 'style/',
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
  const sassConfig2: Object = sassConfig({ isDevelopment });
  const basicConfig: [] = [
    endLoader,
    cssConfig({
      isDevelopment,
      modules,
      isLocals: serverRender
    }),
    sassConfig2
  ];

  // vue
  if(frame === 'vue'){
    cssLoaderConfig.oneOf = [
      { resourceQuery: /scoped/, use: [endLoader, 'css-loader', sassConfig2] },
      { use: basicConfig }
    ];
  }else{
    cssLoaderConfig.use = basicConfig;
  }

  return cssLoaderConfig;
}