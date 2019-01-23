/* 生产环境插件 */
import * as webpack from 'webpack';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import ImageMinWebpackPlugin from 'imagemin-webpack-plugin';
import { handleWebpackBuildProgress } from '../utils/utils';
import { SweetConfig, SweetOptions } from '../utils/types';

export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions): Array<any>{
  const proPlugins: Array<any> = [
    new MiniCssExtractPlugin({
      filename: 'style/[chunkhash:5].css',
      chunkFilename: 'style/[chunkhash:5].css'
    }),
    new OptimizeCssAssets(),
    new ImageMinWebpackPlugin({
      test: /\.(jpe?g|png|gif)$/i
    })
  ];

  // 当环境为测试时，不适用输出插件
  if(sweetConfig.frame !== 'test'){
    proPlugins.push(new webpack.ProgressPlugin(handleWebpackBuildProgress));
  }

  return proPlugins;
}