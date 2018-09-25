/* css-loader 配置 */

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * modules { boolean }: 是否开启css-modules
   * isLocals { boolean }: 是否使用css-loader/locals
   */
  const { isDevelopment, modules, isLocals }: {
    isDevelopment: boolean,
    modules: boolean,
    isLocals: boolean
  } = options;
  const cssLoader: Object = {
    loader: isLocals ? 'css-loader/locals' : 'css-loader'
  };

  if(modules){
    const localIdentName: string = isDevelopment
      ? '[path][name]__[local]___[hash:base64:5]'
      : '_[hash:base64:5]';

    cssLoader.options = {
      modules: true,
      localIdentName
    };
  }

  return cssLoader;
}