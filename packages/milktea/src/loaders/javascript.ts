import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Use } from 'webpack-chain';
import { createBabelOptions, createPresetEnv } from '../config/babelConfig';
import { customizer } from '../utils/utils';
import { SweetConfig, SweetOptions, JS } from '../utils/types';

/* js 配置 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  /**
   * mode { string } 开发模式还是生产模式
   * js { object } loader里面js的配置
   * frame { string } 是否为react或vue模式
   */
  const { mode, js }: SweetConfig = sweetConfig;
  const frame: string | undefined = sweetConfig.frame;
  const isDevelopment: boolean = mode === 'development';

  // 获取配置
  const jsOptions: JS = js || {};
  const { ecmascript, presets, plugins, resetPresets, resetPlugins, exclude, include, targets: customTargets }: JS = jsOptions;
  const debug: boolean = frame === 'test' ? false : (isDevelopment === undefined ? true : isDevelopment);
  const useConfig: object = {
    'babel-loader': {
      loader: 'babel-loader',
      options: createBabelOptions(sweetOptions, jsOptions)
    }
  };

  config
    .merge({
      module: {
        rule: {
          js: {
            test: /^.*\.jsx?$/,
            use: useConfig,
            exclude: exclude ? (_.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (_.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  const configBabelUse: Use = config
    .module
    .rule('javascript.ts')
    .use('babel-loader');

  // ecmascript
  config
    .when(!ecmascript && !resetPresets,
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, {
            presets: [createPresetEnv(customTargets, debug)]
          }, customizer));
      });

  // 判断是否加载react相关插件，热替换
  config
    .when(frame === 'react',
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, {
            presets: resetPresets ? undefined : ['@babel/preset-react'],
            plugins: resetPlugins ? undefined : ['react-hot-loader/babel']
          }, customizer));
      }
    );

  // 判断是否加载vue相关插件
  config
    .when(frame === 'vue',
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, {
            presets: resetPresets ? undefined : ['@vue/babel-preset-jsx']
          }, customizer));
      }
    );

  // 加载presets
  config
    .when(!resetPresets && !!presets,
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, { presets }, customizer));
      }
    );

  // 加载plugins
  config
    .when(!resetPlugins && !!plugins,
      (config: Config): void => {
        configBabelUse
          .tap((options: any): any => _.mergeWith(options, { plugins }, customizer));
      }
    );

  // 排除dll文件，dll文件使用file-loader加载
  config
    .module
    .rule('javascript.ts')
    .exclude
    .add(/\.sweet[\\/]dll[\\/]dll\.js/);
}