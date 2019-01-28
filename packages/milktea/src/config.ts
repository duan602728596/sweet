/* webpack 配置 */
import * as path from 'path';
import loaders from './loaders/loaders';
import plugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { isObject } from './utils/utils';
import { SweetConfig, SweetOptions, WebpackConfig } from './utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): WebpackConfig{
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * externals { any }: 外部扩展
   * resolve { ?Object } 解析
   */
  const sweetConfigCopy: SweetConfig = isObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, entry, output, externals, resolve } = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if('serverRender' in sweetConfigCopy){
    delete sweetConfigCopy.serverRender;
  }

  // webpack配置
  return {
    mode,
    entry,
    output: {
      path: path.join(sweetOptions.basicPath, 'build'),
      filename: isDevelopment
        ? 'script/[name].js'
        : 'script/[chunkhash:5].js',
      chunkFilename: isDevelopment
        ? 'script/[name].js'
        : 'script/[chunkhash:5].js',
      ...output
    },
    externals,
    resolve,
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: {
      rules: loaders(sweetConfigCopy, sweetOptions)
    },
    plugins: plugins(sweetConfigCopy, sweetOptions),
    optimization: optimization(sweetConfigCopy, sweetOptions)
  };
}