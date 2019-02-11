/* css-loader 配置 */
import { LoaderOption } from '../utils/types';

interface CssOption {
  isDevelopment?: boolean;
  modules?: boolean;
  isLocals?: boolean;
}

export default function(options: CssOption = {}): LoaderOption{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * modules { boolean }: 是否开启css-modules
   * isLocals { boolean }: 是否使用css-loader/locals
   */
  const { isDevelopment, modules, isLocals } = options;
  const cssLoader: LoaderOption = {
    loader: 'css-loader'
  };

  if(modules){
    const localIdentName: string = isDevelopment
      ? '[path][name]__[local]___[hash:base64:5]'
      : '_[hash:base64:5]';

    cssLoader.options = {
      modules: true,
      localIdentName,
      exportOnlyLocals: isLocals ? true : false,
      sourceMap: isDevelopment
    };
  }

  return cssLoader;
}