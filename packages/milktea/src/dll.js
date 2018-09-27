/* webpack dll扩展配置 */
import path from 'path';
import process from 'process';
import webpack from 'webpack';
import babelConfig from './config/babel';
import { handleWebpackBuildProgress } from './utils';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * dll { Array }: dll配置
   */
  const sweetConfigCopy: Object = { ...sweetConfig };
  const { mode, dll }: {
    mode: string,
    dll: Array
  } = sweetConfigCopy;
  const ecmascript: boolean = sweetConfigCopy?.js?.ecmascript || false;
  const isDevelopment: boolean = mode === 'development';
  const cwd: string = process.cwd();

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
      path: path.join(cwd, '.dll'),
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
          })]
        }
      ]
    },
    plugins: [
      // dll
      new webpack.DllPlugin({
        path: '.dll/manifest.json',
        name: '[name]_[hash:5]',
        context: cwd
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.ProgressPlugin(handleWebpackBuildProgress)
    ]
  };
}