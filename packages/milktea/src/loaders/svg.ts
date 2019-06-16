import * as Config from 'webpack-chain';
import { createPresetEnv } from '../config/babelConfig';
import { SweetConfig, JS } from '../utils/types';

/* svg文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   * frame { string }: 当前的环境
   */
  const { mode, frame, js }: SweetConfig = sweetConfig;
  const jsOptions: JS = js || {};
  const { ecmascript, targets: customTargets }: JS = jsOptions;

  // 当环境是react时
  const options: { presets: Array<any> } = {
    presets: ['@babel/preset-react']
  };

  if (!ecmascript) {
    options.presets.push(createPresetEnv(customTargets, false));
  }

  config
    .when(frame === 'react',
      (config: Config): void => {
        config
          .module
          .rule('svg')
          .test(/\.svg(\?v=\d+\.\d+\.\d+)?$/)
          .use('babel-loader')
          .loader('babel-loader')
          .options(options)
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

  // issuer
  config
    .when(frame === 'react' || frame === 'vue',
      (config: Config): void => {
        config
          .merge({
            module: {
              rule: {
                svg: { issuer: /^.*\.(jsx?|vue)$/ }
              }
            }
          });
      }
    );
}