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
  const { mode, serverEntry, serverOutput, resolve, rules, plugins }: SweetConfig = sweetConfigCopy;
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
      devtool: isDevelopment ? 'module-eval-source-map' : 'none',
      target: 'node',
      node: {
        __filename: true,
        __dirname: true
      }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, 'buildServer'))
    .filename('[name].js')
    .chunkFilename('[name].js')
    .library('[name]')
    .libraryTarget('umd')
    .publicPath('/');

  // loaders
  loaders(sweetConfigCopy, sweetOptions, config);

  // plugins
  basicPlugins(sweetConfigCopy, sweetOptions, config);

  // optimization
  optimization(sweetConfigCopy, sweetOptions, config);

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry: serverEntry,
    resolve,
    // 添加其他的rules
    module: {
      rules
    },
    // 添加自定义的plugins
    plugins
  });
}