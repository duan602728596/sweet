/* webpack 服务器端渲染配置 */
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
   * resolve { ?Object } 解析
   */
  const sweetConfigCopy: SweetConfig | undefined = isObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, serverEntry, serverOutput, resolve }: SweetConfig = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if (sweetConfigCopy.js && isObject(sweetConfigCopy.js)) {
    sweetConfigCopy.js.ecmascript = true;
  } else {
    sweetConfigCopy.js = {
      ecmascript: true
    };
  }

  // webpack配置
  return {
    mode,
    entry: serverEntry,
    output: {
      path: path.join(sweetOptions.basicPath, 'buildServer'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      library: '[name]',
      libraryTarget: 'umd',
      publicPath: '/',
      ...serverOutput
    },
    devtool: isDevelopment ? 'module-source-map' : 'none',
    resolve,
    module: {
      rules: loaders(sweetConfigCopy, sweetOptions)
    },
    plugins: plugins(sweetConfigCopy, sweetOptions),
    optimization: optimization(sweetConfigCopy, sweetOptions),
    // webpack服务器端编辑属性
    target: 'node',
    node: {
      __filename: true,
      __dirname: true
    }
  };
}