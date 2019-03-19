import * as Config from 'webpack-chain';
import { SweetConfig } from '../utils/types';

/* svg文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   */
  const { mode, serverRender, frame }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = isDevelopment ? '[name].[hash:5].[ext]' : '[hash:5].[ext]';

  // 当不是react或vue时
  config
    .when(!(frame === 'react' || frame === 'vue'),
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .test(/\.svg$/)
          .use('file-loader')
          .loader('file-loader')
          .options( {
            name: filename,
            emitFile: !serverRender
          });
      }
    );

  // 当环境是react时
  config
    .when(frame === 'react',
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
          .use('babel-loader')
          .loader('babel-loader')
          .end()
          .use('@svgr/webpack')
          .loader('@svgr/webpack')
          .options({
            babel: false,
            icon: true
          });
      }
    );

  // 当环境是vue时
  config
    .when(frame === 'vue',
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
          .use('vue-svg-loader')
          .loader('vue-svg-loader');
      }
    );
}