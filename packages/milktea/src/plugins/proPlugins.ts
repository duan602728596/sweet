import * as webpack from 'webpack';
import * as Config from 'webpack-chain';
import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import * as OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import { handleDefaultProgress, handleServerRenderProgress } from './handleProgress';
import type { SweetConfig, SweetOptions } from '../utils/types';

/* 生产环境插件 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { serverRender, webpackLog }: SweetConfig = sweetConfig;

  config
    // mini-css-extract-plugin
    .plugin('mini-css-extract-plugin')
    .use(MiniCssExtractPlugin, [{
      filename: '[name]_[chunkhash:15].css',
      chunkFilename: '[name]_[chunkhash:15].css'
    }])
    .end()
    // css压缩
    .plugin('optimize-css-assets-webpack-plugin')
    .use(OptimizeCssAssets);

  // 当环境为测试时，不使用输出插件
  config
    .when(sweetConfig.frame !== 'test' && webpackLog === 'stats',
      (config: Config): void => {
        config
          .plugin('webpack.ProgressPlugin')
          .use(webpack.ProgressPlugin, [
            serverRender
              ? handleServerRenderProgress
              : handleDefaultProgress
          ]);
      }
    );
}