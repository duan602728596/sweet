import * as path from 'path';
import * as Config from 'webpack-chain';
import * as TerserPlugin from 'terser-webpack-plugin';
import { terserCache } from '../config/cacheConfig';
import { SweetConfig, SweetOptions } from '../utils/types';

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
      automaticNameDelimiter: '.'
    });

  // 设置minimizer的压缩插件
  config
    .when(!isDevelopment,
      (config: Config): void => {
        const terserOptions: TerserOptions = {
          ecma: js && js.ecmascript ? 8 : 5,
          safari10: true
        };

        config
          .optimization
          .minimizer('minimizer')
          .use(TerserPlugin, [{
            cache: path.join(sweetOptions.basicPath, terserCache),
            parallel: true,
            sourceMap: true,
            extractComments: false,
            terserOptions
          }]);
      }
    );
}