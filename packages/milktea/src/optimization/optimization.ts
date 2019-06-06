import * as path from 'path';
import * as Config from 'webpack-chain';
import * as TerserPlugin from 'terser-webpack-plugin';
import { SweetConfig, SweetOptions } from '../utils/types';

interface TerserOptions {
  ecma: number;
  safari10: boolean;
}

/* 配置optimization属性 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 是否为服务器端渲染
   * js { object }: js配置
   */
  const { mode = 'development', serverRender, js }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 设置splitChunks配置
  config
    .optimization
    .splitChunks({
      chunks: 'all',
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
            cache: path.join(sweetOptions.basicPath, '.sweet/cache/terser'),
            parallel: true,
            terserOptions
          }]);
      }
    );
}