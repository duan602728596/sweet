/* webpack 服务器端渲染配置 */
import * as path from 'path';
import * as _ from 'lodash';
import { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import * as merge from 'webpack-merge';
import loaders from './loaders/loaders';
import basicPlugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { SweetConfig, SweetOptions } from './utils/types';

export default function(sweetConfig: SweetConfig | null | undefined, sweetOptions: SweetOptions): Configuration {
  const config: Config = new Config();
  const sweetConfigCopy: SweetConfig | undefined = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
  const {
    mode,
    serverEntry,
    serverOutput,
    serverExternals,
    resolve,
    rules,
    noParse,
    plugins,
    serverDevtool,
    serverChainWebpack
  }: SweetConfig = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化ecmascript配置
  if (sweetConfigCopy.js && _.isPlainObject(sweetConfigCopy.js)) {
    sweetConfigCopy.js.ecmascript = true;
  } else {
    sweetConfigCopy.js = { ecmascript: true };
  }

  // 合并配置
  config
    .merge({
      mode,
      devtool: serverDevtool ?? (isDevelopment ? 'module-eval-source-map' : 'module-source-map'),
      resolve: {
        extensions: ['.js', '.jsx', '.mjs', '.wasm', '.json', '.ts', '.tsx']
      },
      target: 'async-node',
      node: {
        __filename: true,
        __dirname: true
      },
      performance: {
        hints: false
      }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'dist-server'))
    .filename('[name].js')
    .chunkFilename('[name]_chunk.js')
    .library('[name]')
    .libraryTarget('umd')
    .globalObject('this');

  // loaders
  loaders(sweetConfigCopy, sweetOptions, config);

  // plugins
  basicPlugins(sweetConfigCopy, sweetOptions, config);

  // optimization
  optimization(sweetConfigCopy, sweetOptions, config, true);

  /* serverChainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (serverChainWebpack) {
    serverChainWebpack(config);
  }

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry: serverEntry,
    output: serverOutput,
    externals: serverExternals,
    resolve,
    // 添加其他的rules
    module: { noParse, rules },
    // 添加自定义的plugins
    plugins
  });
}