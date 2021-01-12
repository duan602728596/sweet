import * as _ from 'lodash';
import * as Config from 'webpack-chain';
import type { Use, LoaderOptions } from 'webpack-chain';
import { customizer, versionReturn } from '../utils/utils';
import { createBabelForTsOptions, createTypescriptOptions } from '../config/babelConfig';
import type { SweetConfig, SweetOptions, TS } from '../utils/types';

/* ts 配置 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { ts = {}, frame }: SweetConfig = sweetConfig;
  const { configFile, presets = [], plugins = [], exclude, include }: TS = ts;

  const useConfig: object = {
    'babel-loader': {
      loader: 'babel-loader',
      options: createBabelForTsOptions(sweetOptions)
    },
    'ts-loader': {
      loader: 'ts-loader',
      options: createTypescriptOptions(configFile)
    }
  };

  config
    .merge({
      module: {
        rule: {
          ts: {
            test: /^.*\.tsx?$/i,
            use: useConfig,
            exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (Array.isArray(include) ? include : [include]) : []
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
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, {
            plugins: ['react-hot-loader/babel']
          }, customizer));
      }
    );

  // 判断是否加载vue相关插件
  config
    .when(frame === 'vue',
      (config: Config): void => {
        configBabelUse
          .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, versionReturn<object>(
            'vue',
            (n: number): boolean => n >= 3,
            { plugins: ['@vue/babel-plugin-jsx'] },
            { presets: ['@vue/babel-preset-jsx'] }
          ), customizer));
      }
    );

  // 加载presets
  configBabelUse
    .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, { presets }, customizer));

  // 加载plugins
  configBabelUse
    .tap((options: LoaderOptions): LoaderOptions => _.mergeWith(options, { plugins }, customizer));
}