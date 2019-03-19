import * as Config from 'webpack-chain';
import { SweetConfig } from '../utils/types';

/* html 配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   */
  const mode: string | undefined = sweetConfig.mode;
  const isDevelopment: boolean = mode === 'development';

  config
    .module
    .rule('html')
    .test(/^.*\.pug$/)
    .use('pug-loader')
    .loader('pug-loader')
    .options({
      pretty: isDevelopment,
      name: '[name].html'
    });
}