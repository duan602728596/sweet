/* 生产环境插件 */
import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import { handleWebpackBuildProgress } from '../utils/utils';
import { SweetConfig, SweetOptions } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Array<any>{
  return [
    new MiniCssExtractPlugin({
      filename: 'style/[chunkhash:5].css',
      chunkFilename: 'style/[chunkhash:5].css'
    }),
    new OptimizeCssAssets(),
    new webpack.ProgressPlugin(handleWebpackBuildProgress)
  ];
}