import * as path from 'path';
import * as _ from 'lodash';
import type { Configuration, RuleSetRule } from 'webpack';
import * as Config from 'webpack-chain';
import { merge } from 'webpack-merge';
import loaders from './loaders/loaders';
import basicPlugins from './plugins/plugins';
import optimization from './optimization/optimization';
import { extensions } from './utils/utils';
import type { SweetConfig, SweetOptions } from './utils/types';

/**
 * webpack 服务器端渲染配置
 * @param { SweetConfig | null | undefined } sweetConfig: 获取到的外部配置
 * @param { SweetOptions } sweetOptions: 内部挂载的一些配置
 */
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
      devtool: serverDevtool ?? (isDevelopment ? 'eval-source-map' : 'source-map'),
      resolve: { extensions },
      target: 'node',
      performance: { hints: false },
      node: {
        __filename: true,
        __dirname: true
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
    module: {
      noParse,
      rules: rules as RuleSetRule[]
    },
    // 添加自定义的plugins
    plugins
  });
}