/* webpack 配置 */
import loaders from './loaders/loaders';
import plugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { isObject } from './utils';

export default function(sweetConfig: Object = {}, sweetOptions: Object): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * externals { any }: 外部扩展
   * resolve { ?Object } 解析
   */
  const sweetConfigCopy: Object = isObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode = 'development', entry, output, externals, resolve }: {
    mode: string,
    entry: any,
    output: any,
    externals: any,
    resolve: ?Object
  } = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if('serverRender' in sweetConfigCopy){
    delete sweetConfigCopy.serverRender;
  }

  // webpack配置
  return {
    mode,
    entry,
    output,
    externals,
    resolve,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: { rules: loaders(sweetConfigCopy, sweetOptions) },
    plugins: plugins(sweetConfigCopy, sweetOptions),
    optimization: optimization(sweetConfigCopy, sweetOptions)
  };
}