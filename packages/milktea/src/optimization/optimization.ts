import type { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import type { MinifyOptions } from 'terser';
import type { SweetConfig, SweetOptions } from '../utils/types.js';

/* 配置optimization属性 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration, asyncChunks?: boolean): void {
  const { mode = 'development', javascript }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const webpackOptimization: Configuration['optimization'] = {};

  // 设置splitChunks配置

  Object.assign(webpackOptimization, {
    splitChunks: {
      chunks: asyncChunks ? 'async' : 'all',
      automaticNameDelimiter: '.',
      minChunks: 2
    }
  });

  // 设置minimizer的压缩插件
  if (!isDevelopment) {
    const terserOptions: MinifyOptions = {
      ecma: javascript?.ecmascript ? 2020 : 5,
      safari10: true
    };

    Object.assign(webpackOptimization, {
      minimizer: [
        new TerserPlugin({
          extractComments: false,
          terserOptions
        }),
        new CssMinimizerPlugin()
      ]
    });
  }
}