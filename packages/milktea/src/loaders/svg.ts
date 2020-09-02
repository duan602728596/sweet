import * as Config from 'webpack-chain';
import { createImageConfig } from '../config/imageConfig';
import type { SweetConfig } from '../utils/types';

/* svg文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  const { frame }: SweetConfig = sweetConfig;

  config
    .when(frame === 'react',
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .test(/\.svg$/i)
          .use('@svgr/webpack')
          .loader('@svgr/webpack')
          .end()
          .use('url-loader')
          .loader('url-loader')
          .options(createImageConfig(sweetConfig));
      }
    );

  // 当环境是vue时
  config
    .when(frame === 'vue',
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .test(/component\.svg$/i)
          .use('vue-loader')
          .loader('vue-loader')
          .end()
          .use('vue-svg-loader')
          .loader('vue-svg-loader');
      }
    );

  // issuer
  config
    .when(frame === 'react' || frame === 'vue',
      (config: Config): void => {
        config
          .merge({
            module: {
              rule: {
                svg: { issuer: /^.*\.(jsx?|tsx?|vue)$/i }
              }
            }
          });
      }
    );
}