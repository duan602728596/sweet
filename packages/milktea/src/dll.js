/* webpack dll扩展配置 */
import path from 'path';
import process from 'process';
import webpack from 'webpack';
import babelConfig from './config/babel';
import { handleWebpackProgress } from './utils';

export default function(sweetConfig: Object = {}): Object{
  /**
   * mode { string }: 开发模式还是生产模式
   * dll { Array }: dll配置
   */
  const sweetConfig2: Object = { ...sweetConfig };
  const { mode, dll }: {
    mode: string,
    dll: Array
  } = sweetConfig2;
  const ecmascript: boolean = sweetConfig2?.js?.ecmascript || false;
  const isDevelopment: boolean = mode === 'development';
  const cwd: string = process.cwd();

  // format
  if('serverRender' in sweetConfig2){
    delete sweetConfig2.serverRender;
  }

  // 配置dll的babel config
  const dllResetPresetsConfig: [] = [];

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
      new webpack.ProgressPlugin(handleWebpackProgress)
    ]
  };
}