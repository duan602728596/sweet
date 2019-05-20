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
  /**
   * mode { string }: 开发模式还是生产模式
   * entry { any }: 文件入口
   * output { any }: 文件出口
   * externals { any }: 外部扩展
   * resolve { object } 解析
   * rules { Array<RuleSetRule> }: 自定义规则
   * plugins { Array<any> }: 自定义插件
   */
  const sweetConfigCopy: SweetConfig = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, entry, output, externals, resolve, rules, noParse, plugins, devtool }: SweetConfig = sweetConfigCopy;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if ('serverRender' in sweetConfigCopy) {
    delete sweetConfigCopy.serverRender;
  }

  // webpack配置
  const filename: string = isDevelopment ? '[name]_[hash:5].js' : '[chunkhash:15].js';

  // 合并配置
  config
    .merge({
      mode,
      devtool: devtool ? devtool : (isDevelopment ? 'module-eval-source-map' : 'none')
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'build'))
    .filename(filename)
    .chunkFilename(filename);

  // loaders
  loaders(sweetConfigCopy, sweetOptions, config);

  // plugins
  basicPlugins(sweetConfigCopy, sweetOptions, config);

  // optimization
  optimization(sweetConfigCopy, sweetOptions, config);

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry,
    output,
    externals,
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