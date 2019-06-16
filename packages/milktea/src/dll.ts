/* webpack dll扩展配置 */
import * as path from 'path';
import * as _ from 'lodash';
import * as webpack from 'webpack';
import { Configuration } from 'webpack';
import * as Config from 'webpack-chain';
import * as merge from 'webpack-merge';
import { createPresetEnv, createTargets } from './config/babelConfig';
import handleProgress from './plugins/handleProgress';
import { babelCache, dllCache } from './config/cacheConfig';
import { SweetConfig, SweetOptions, JS } from './utils/types';

export default function(sweetConfig: SweetConfig | null | undefined, sweetOptions: SweetOptions): Configuration {
  const config: Config = new Config();

  /**
   * mode { string }: 开发模式还是生产模式
   * dll { Array<string> }: dll配置
   */
  const sweetConfigCopy: SweetConfig = _.isPlainObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, dll, externals, resolve, chainWebpack, js }: SweetConfig = sweetConfigCopy;

  const jsOptions: JS = js || {};
  const { ecmascript, targets: customTargets }: JS = jsOptions;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if ('serverRender' in sweetConfigCopy) {
    delete sweetConfigCopy.serverRender;
  }

  // 合并配置
  config
    .merge({
      mode: 'development',
      devtool: isDevelopment ? 'inline-module-source-map' : 'none',
      resolve: {
        extensions: ['.js', '.jsx', '.mjs', '.json', '.ts', '.tsx']
      }
    });

  // 设置文件输出
  config
    .output
    .path(path.join(sweetOptions.basicPath, dllCache))
    .filename('[name].js')
    .library('[name]_[hash:5]')
    .libraryTarget('var');

  // babel
  config
    .when(!ecmascript,
      (config: Config): void => {
        config
          .module
          .rule('dll')
          .use('babel-loader')
          .loader('babel-loader')
          .options({
            presets: [createPresetEnv(customTargets, false, true)],
            cacheDirectory: path.join(sweetOptions.basicPath, babelCache),
            configFile: false,
            babelrc: false
          });
      }
    );

  // plugin
  config
    // dll
    .plugin('webpack.DllPlugin')
    .use(webpack.DllPlugin, [{
      path: path.join(dllCache, 'manifest.json'),
      name: '[name]_[hash:5]',
      context: sweetOptions.basicPath
    }])
    .end()
    // moment
    .plugin('webpack.IgnorePlugin')
    .use(webpack.IgnorePlugin, [{
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }])
    .end()
    // 进度条
    .plugin('webpack.ProgressPlugin')
    .use(webpack.ProgressPlugin, [handleProgress]);

  /* chainWebpack: 通过webpack-chain的API扩展或修改webpack配置 */
  if (chainWebpack) {
    chainWebpack(config);
  }

  /* 合并自定义配置 */
  return merge(config.toConfig(), {
    entry: {
      dll
    },
    externals,
    resolve
  });
}