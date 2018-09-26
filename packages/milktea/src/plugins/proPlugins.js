/* 生产环境插件 */
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import { handleWebpackBuildProgress } from '../utils';

export default function(): Array{
  return [
    new MiniCssExtractPlugin({
      filename: 'style/[chunkhash:5].css',
      chunkFilename: 'style/[chunkhash:5].css'
    }),
    new OptimizeCssAssets(),
    new webpack.ProgressPlugin(handleWebpackBuildProgress)
  ];
}