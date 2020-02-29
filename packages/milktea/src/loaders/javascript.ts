import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import { Use, LoaderOptions } from 'webpack-chain';
import { createBabelOptions, createPresetEnv, createPresetTypescript } from '../config/babelConfig';
import { customizer } from '../utils/utils';
import { SweetConfig, SweetOptions, JS } from '../utils/types';

/* js 配置 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { mode, js, frame, webpackLog = 'progress' }: SweetConfig = sweetConfig;
  const isDevelopment: boolean = mode === 'development';

  // 获取配置
  const jsOptions: JS = js ?? {};
  const {
    ecmascript,
    typescript,
    presets,
    plugins,
    resetPresets,
    resetPlugins,
    exclude,
    include,
    targets: customTargets
  }: JS = jsOptions;
  const debug: boolean = frame === 'test' ? false : isDevelopment;
  const useTypescript: boolean = !!typescript;
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
            test: useTypescript ? /^.*\.(j|t)sx?$/ : /^.*\.jsx?$/,
            use: useConfig,
            exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (Array.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  const configBabelUse: Use = config
    .module
    .rule('js')
    .use('babel-loader');

  // ecmascript
  config
    .when(!ecmascript && !resetPresets,
      (config: Config): void => {
        configBabelUse
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, {
            presets: [createPresetEnv(customTargets, (!webpackLog || webpackLog !== 'progress') && debug)]
          }, customizer));
      });

  // typescript
  config
    .when(useTypescript,
      (config: Config): void => {
        const isReact: boolean = !(frame === 'vue');

        configBabelUse
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, {
            presets: [createPresetTypescript(isReact)]
          }, customizer));
      });

  // 判断是否加载react相关插件，热替换
  config
    .when(frame === 'react',
      (config: Config): void => {
        configBabelUse
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, {
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
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, {
            presets: resetPresets ? undefined : ['@vue/babel-preset-jsx']
          }, customizer));
      }
    );

  // 加载presets
  config
    .when(!resetPresets && !!presets,
      (config: Config): void => {
        configBabelUse
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, { presets }, customizer));
      }
    );

  // 加载plugins
  config
    .when(!resetPlugins && !!plugins,
      (config: Config): void => {
        configBabelUse
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, { plugins }, customizer));
      }
    );

  // 排除dll文件，dll文件使用file-loader加载
  config
    .module
    .rule('js')
    .exclude
    .add(/\.sweet[\\/]dll[\\/]dll\.js/);
}