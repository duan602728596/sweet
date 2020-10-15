import * as path from 'path';
import * as Config from 'webpack-chain';
import * as TerserPlugin from 'terser-webpack-plugin';
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
  // TODO: [webpack@5.0.0-beta.30]会导致错误
  config
    .optimization
    .splitChunks({
      chunks: asyncChunks ? 'async' : 'all',
      automaticNameDelimiter: '.'
    });

  // 设置minimizer的压缩插件
  config
    .when(!isDevelopment,
      (config: Config): void => {
        const terserOptions: TerserOptions = {
          ecma: js?.ecmascript ? 2017 : 5,
          safari10: true
        };

        config
          .optimization
          .minimizer('minimizer')
          .use(TerserPlugin, [{
            extractComments: false,
            terserOptions
          }]);
      }
    );
}