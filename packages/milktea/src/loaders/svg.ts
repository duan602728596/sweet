import * as Config from 'webpack-chain';
import { targets } from './js';
import { SweetConfig, JS } from '../utils/types';

/* svg文件配置 */
export default function(sweetConfig: SweetConfig, config: Config): void {
  /**
   * mode { string }: 开发模式还是生产模式
   * serverRender { boolean }: 开启服务器端渲染
   * frame { string }: 当前的环境
   */
  const { mode, serverRender, frame, js }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';
  const filename: string = isDevelopment ? 'images/[name]_[hash:5].[ext]' : 'images/[hash:15].[ext]';
  const _js: JS = js || {};
  const { ecmascript, targets: customTargets }: JS = _js;

  // 当环境是react时
  const options: { presets: Array<any> } = {
    presets: ['@babel/preset-react']
  };

  if (!ecmascript) {
    options.presets.push([
      '@babel/preset-env',
      {
        targets: customTargets ? customTargets : targets,
        debug: false,
        modules: false,
        useBuiltIns: 'usage'
      }
    ]);
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