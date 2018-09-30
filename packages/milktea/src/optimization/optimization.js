/* 配置optimization属性 */
import TerserPlugin from 'terser-webpack-plugin';

export default function(sweetConfig: Object): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 是否为服务器端渲染
   * js { ?Object }: js配置
   */
  const { mode = 'development', serverRender, js }: {
    mode: string,
    serverRender: boolean,
    js: ?Object
  } = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const optimization: Object = {};

  // 设置splitChunks配置
  if(!isDevelopment && !serverRender){
    optimization.splitChunks = {
      chunks: 'all',
      automaticNameDelimiter: '.'
    };
  }

  // 设置minimizer的压缩插件
  if(!isDevelopment){
    const terserOption: Object = {};

    if(js && js.ecmascript){
      terserOption.ecma = 8;
    }else{
      terserOption.ecma = 5;
    }

    optimization.minimizer = [new TerserPlugin(terserOption)];
  }

  return optimization;
}