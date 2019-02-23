/* webpack 配置 */
import * as path from 'path';
import loaders from './loaders/loaders';
import plugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { isObject } from './utils/utils';
import { SweetConfig, SweetOptions, WebpackConfig } from './utils/types';

export default function(sweetConfig: SweetConfig | null, sweetOptions: SweetOptions): WebpackConfig {
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * externals { any }: 外部扩展
   * resolve { ?Object } 解析
   */
  const sweetConfigCopy: SweetConfig = isObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, entry, output, externals, resolve }: SweetConfig = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if ('serverRender' in sweetConfigCopy) {
    delete sweetConfigCopy.serverRender;
  }

  // webpack配置
  const filename: string = isDevelopment ? '[name].js' : '[chunkhash:5].js';
  const webpackOutput: {
    path: string;
    filename: string;
    chunkFilename: string;
  } = {
    path: path.join(sweetOptions.basicPath, 'build'),
    filename,
    chunkFilename: filename
  };

  if (output) {
    Object.assign(webpackOutput, output);
  }

  return {
    mode,
    entry,
    output: webpackOutput,
    externals,
    resolve,
    devtool: isDevelopment ? 'module-eval-source-map' : 'none',
    module: {
      rules: loaders(sweetConfigCopy, sweetOptions)
    },
    plugins: plugins(sweetConfigCopy, sweetOptions),
    optimization: optimization(sweetConfigCopy, sweetOptions)
  };
}