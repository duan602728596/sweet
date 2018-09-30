/* webpack dll扩展配置 */
import path from 'path';
import webpack from 'webpack';
import babelConfig from './config/babel';
import { handleWebpackBuildProgress, isObject } from './utils';

export default function(sweetConfig: Object = {}, sweetOptions: Object): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * dll { Array }: dll配置
   */
  const sweetConfigCopy: Object = isObject(sweetConfig) ? { ...sweetConfig } : {};
  const { mode, dll }: {
    mode: string,
    dll: Array
  } = sweetConfigCopy;
  const ecmascript: boolean = sweetConfigCopy?.js?.ecmascript || false;
  const isDevelopment: boolean = mode === 'development';

  // 格式化配置
  if('serverRender' in sweetConfigCopy){
    delete sweetConfigCopy.serverRender;
  }

  // 配置dll的babel config
  const dllResetPresetsConfig: [] = [];

  // 是否编译到ecmascript
  if(!ecmascript){
    dllResetPresetsConfig.push([
      '@babel/preset-env',
      {
        targets: {
          ie: 11,
          edge: 16,
          chrome: 62,
          firefox: 56
        },
        debug: false,
        modules: false,
        useBuiltIns: false
      }
    ]);
  }

  // webpack配置
  return {
    mode: 'development',
    entry: { dll },
    output: {
      path: path.join(sweetOptions.basicPath, '.dll'),
      filename: '[name].js',
      library: '[name]_[hash:5]',
      libraryTarget: 'var'
    },
    devtool: isDevelopment ? 'module-source-map' : 'none',
    module: {
      rules: [
        {
          test: /^.*\.js$/,
          use: [babelConfig({
            resetPresets: dllResetPresetsConfig
          }, sweetOptions)]
        }
      ]
    },
    plugins: [
      // dll
      new webpack.DllPlugin({
        path: '.dll/manifest.json',
        name: '[name]_[hash:5]',
        context: sweetOptions.basicPath
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProgressPlugin(handleWebpackBuildProgress)
    ]
  };
}