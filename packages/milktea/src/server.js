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
  const sweetConfigCopy: Object = { ...sweetConfig };
  const { mode = 'development', serverEntry, serverOutput }: {
    mode: string,
    serverEntry: any,
    serverOutput: any
  } = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if(isObject(sweetConfigCopy.js)){
    sweetConfigCopy.js.ecmascript = true;
  }else{
    sweetConfigCopy.js = { ecmascript: true };
  }

  // webpack配置
  const config: Object = {
    mode,
    entry: serverEntry,
    output: serverOutput,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: { rules: loaders(sweetConfigCopy) },
    plugins: plugins(sweetConfigCopy),
    target: 'node',
    node: {
      __filename: true,
      __dirname: true
    }
  };

  if(!isDevelopment){
    config.optimization = {
      minimizer: [new TerserPlugin()]
    };
  }

  return config;
}