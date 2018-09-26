/* webpack 服务器端渲染配置 */
import TerserPlugin from 'terser-webpack-plugin';
import loaders from './loaders/loaders';
import plugins from './plugins/plugins';
import { isObject } from './utils';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   */
  const sweetConfig2: Object = { ...sweetConfig };
  const { mode = 'development', serverEntry, serverOutput }: {
    mode: string,
    serverEntry: any,
    serverOutput: any
  } = sweetConfig2;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if(isObject(sweetConfig2.js)){
    sweetConfig2.js.ecmascript = true;
  }else{
    sweetConfig2.js = { ecmascript: true };
  }

  // webpack配置
  const config: Object = {
    mode,
    entry: serverEntry,
    output: serverOutput,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: { rules: loaders(sweetConfig2) },
    plugins: plugins(sweetConfig2),
    target: 'node',
    node: {
      __filename: true,
      __dirname: true
    }
  };

  if(!isDevelopment){
    config.optimization = {
      splitChunks: {
        chunks: 'all',
        automaticNameDelimiter: '.'
      },
      minimizer: [new TerserPlugin()]
    };
  }

  return config;
}