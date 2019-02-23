/* 生产环境插件 */
import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import ImageMinWebpackPlugin from 'imagemin-webpack-plugin';
import { SweetConfig, SweetOptions } from '../utils/types';

/* 格式化输出 */
function handleWebpackBuildProgress(percentage: number, message: string, ...args: Array<any>): void {
  const schedule: number = Number(percentage.toFixed(2)) * 100;
  const pNumber: string[] = `${ schedule }`.split('.');

  console.info('\x1B[46m%s\x1B[49m', `${ pNumber[0] }%`, message, ...args);
}

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Array<any> {
  const proPlugins: Array<any> = [
    new MiniCssExtractPlugin({
      filename: '[chunkhash:5].css',
      chunkFilename: '[chunkhash:5].css'
    }),
    new OptimizeCssAssets(),
    new ImageMinWebpackPlugin({
      test: /\.(jpe?g|png|gif)$/i
    })
  ];

  // 当环境为测试时，不使用输出插件
  if (sweetConfig.frame !== 'test') {
    proPlugins.push(new webpack.ProgressPlugin(handleWebpackBuildProgress));
  }

  return proPlugins;
}