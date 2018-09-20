/* css-loader 配置 */

export default function(options: Object = {}): Object{
  /**
   * isDevelopment { boolean }: 是否为开发环境
   * modules { boolean }: 是否开启css-modules
   */
  const { isDevelopment, modules }: {
    isDevelopment: boolean,
    modules: boolean
  } = options;
  const cssLoader: Object = {
    loader: 'css-loader'
  };

  if(modules){
    const localIdentName: string = isDevelopment
      ? '[path][name]__[local]___[hash:base64:5]'
      : '_[hash:base64:5]';

    cssLoader.option = {
      modules: true,
      localIdentName
    };
  }

  return cssLoader;
}