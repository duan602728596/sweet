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

  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * resolve { object } 解析
   * rules { Array<RuleSetRule> }: 自定义规则
   * plugins { Array<any> }: 自定义插件
   */
  const sweetConfigCopy: SweetConfig | undefined = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, serverEntry, serverOutput, resolve, rules, noParse, plugins, devtool, chainWebpack }: SweetConfig = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if (sweetConfigCopy.js && _.isPlainObject(sweetConfigCopy.js)) {
    sweetConfigCopy.js.ecmascript = true;
  } else {
    sweetConfigCopy.js = { ecmascript: true };
  }

  // 合并配置
  config
    .merge({
      mode,
      devtool: devtool ? devtool : (isDevelopment ? 'module-eval-source-map' : 'module-source-map'),
      target: 'async-node',
      node: {
        __filename: true,
        __dirname: true
      }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'dist-server'))
    .filename('[name].javascript.ts')
    .chunkFilename('[name].javascript.ts')
    .library('[name]')
    .libraryTarget('umd');

  // loaders
  loaders(sweetConfigCopy, sweetOptions, config);

  // plugins
  basicPlugins(sweetConfigCopy, sweetOptions, config);

  // optimization
  optimization(sweetConfigCopy, sweetOptions, config, true);

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    chainWebpack(config);
  }

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry: serverEntry,
    output: serverOutput,
    resolve,
    // 添加其他的rules
    module: {
      noParse,
      rules
    },
    // 添加自定义的plugins
    plugins
  });
}