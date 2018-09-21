/* 生产环境插件 */
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';

export default function(): Array{
  return [
    new MiniCssExtractPlugin({
      filename: 'style/[chunkhash:5].css',
      chunkFilename: 'style/[chunkhash:5].css'
    }),
    new OptimizeCssAssets()
  ];
}