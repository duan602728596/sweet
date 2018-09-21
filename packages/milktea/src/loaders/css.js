/* css 配置 */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import sassConfig from '../config/sass';
import cssConfig from '../config/css';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * css { Object }: loader里面css的配置
   * frame { ?string }: 是否为react或vue模式
   */
  const { mode, css, frame }: {
    mode: string,
    css: {
      publicPath: string,
      modules: boolean,
      exclude: RegExp
    },
    frame: ?string
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const { publicPath, modules, exclude }: {
    publicPath: string,
    modules: boolean,
    exclude: RegExp
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

  return {
    test: /^.*\.s(a|c)ss$/,
    use: [
      endLoader,
      cssConfig({
        isDevelopment,
        modules
      }),
      sassConfig({
        isDevelopment
      })
    ],
    exclude
  };
}