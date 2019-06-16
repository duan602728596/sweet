import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Use } from 'webpack-chain';
import { customizer } from '../utils/utils';
import { createBabelForTsOptions } from '../config/babelConfig';
import { SweetConfig, SweetOptions, TS } from '../utils/types';

/* ts 配置 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * mode { string } 开发模式还是生产模式
   * ts { object } loader里面ts的配置
   * frame { string } 是否为react或vue模式
   */
  const { mode, ts }: SweetConfig = sweetConfig;
  const frame: string | undefined = sweetConfig.frame;

  // 获取配置
  const tsOptions: TS = ts || {};
  const { typescript, presets, plugins, exclude, include }: TS = tsOptions;

  // 不启动typescript
  if (!typescript) {
    return;
  }

  const useConfig: object = {
    'babel-loader': {
      loader: 'babel-loader',
      options: createBabelForTsOptions(sweetOptions)
    },
    'ts-loader': {
      loader: 'ts-loader'
    }
  };

  config
    .merge({
      module: {
        rule: {
          ts: {
            test: /^.*\.tsx?$/,
            use: useConfig,
            exclude: exclude ? (_.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (_.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  const configBabelUse: Use = config
    .module
    .rule('ts')
    .use('babel-loader');

  // 判断是否加载react相关插件，热替换
  config
    .when(frame === 'react',
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, {
            plugins: ['react-hot-loader/babel']
          }, customizer));
      }
    );

  // 判断是否加载vue相关插件
  config
    .when(frame === 'vue',
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, {
            presets: ['@vue/babel-preset-jsx']
          }, customizer));
      }
    );

  // 加载presets
  configBabelUse
    .tap((options: any): any => _.mergeWith(options, { presets }, customizer));

  // 加载plugins
  configBabelUse
    .tap((options: any): any => _.mergeWith(options, { plugins }, customizer));
}