import * as TerserPlugin from 'terser-webpack-plugin';
import * as CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import type * as Config from 'webpack-chain';
import type { SweetConfig, SweetOptions } from '../utils/types';

interface TerserOptions {
  ecma: number;
  safari10: boolean;
}

/* 配置optimization属性 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config, asyncChunks?: boolean): void {
  const { mode = 'development', js }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 设置splitChunks配置
  config
    .optimization
    .splitChunks({
      chunks: asyncChunks ? 'async' : 'all',
      automaticNameDelimiter: '.',
      minChunks: 2
    });

  // 设置minimizer的压缩插件
  config
    .when(!isDevelopment,
      (config: Config): void => {
        const terserOptions: TerserOptions = {
          ecma: js?.ecmascript ? 2020 : 5,
          safari10: true
        };

        config
          .optimization
          // js代码压缩
          .minimizer('terser-webpack-plugin')
          .use(TerserPlugin, [{
            extractComments: false,
            terserOptions
          }])
          .end()
          // css代码压缩
          .minimizer('css-minimizer-webpack-plugin')
          .use(CssMinimizerPlugin);
      }
    );
}