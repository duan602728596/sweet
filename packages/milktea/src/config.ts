/* webpack 配置 */
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
  const sweetConfigCopy: SweetConfig = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
  const {
    mode,
    entry,
    output,
    externals,
    resolve,
    rules,
    noParse,
    plugins,
    devtool,
    chainWebpack
  }: SweetConfig = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if ('serverRender' in sweetConfigCopy) {
    delete sweetConfigCopy.serverRender;
  }

  // webpack配置
  const filename: string = isDevelopment ? 'scripts/[name].js' : 'scripts/[chunkhash:15].js';
  const chunkFilename: string = isDevelopment ? 'scripts/[name]_chunk.js' : 'scripts/[chunkhash:15].js';

  // 合并配置
  config
    .merge({
      mode,
      devtool: devtool ?? (isDevelopment ? 'eval-source-map' : false),
      resolve: {
        extensions: ['.js', '.jsx', '.mjs', '.json', '.wasm', '.ts', '.tsx']
      },
      performance: {
        hints: false
      }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'dist'))
    .filename(filename)
    .chunkFilename(chunkFilename)
    .globalObject('this');

  // loaders
  loaders(sweetConfigCopy, sweetOptions, config);

  // plugins
  basicPlugins(sweetConfigCopy, sweetOptions, config);

  // optimization
  optimization(sweetConfigCopy, sweetOptions, config, false);

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    chainWebpack(config);
  }

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry,
    output,
    externals,
    resolve,
    // 添加其他的rules
    module: { noParse, rules },
    // 添加自定义的plugins
    plugins
  });
}