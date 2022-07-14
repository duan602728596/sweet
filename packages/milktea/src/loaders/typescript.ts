import _ from 'lodash';
import type Config from 'webpack-chain';
import type { LoaderOptions } from 'webpack-chain';
import type { PluginItem } from '@babel/core';
import { customizer } from '../utils/utils.js';
import { createBabelOptions, createTypescriptOptions } from '../config/babelConfig.js';
import type { SweetConfig, SweetOptions, TSOptions } from '../utils/types.js';

const RULE_NAME: string = 'typescript';

/* ts 配置 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): void {
  const { mode, typescript = {}, frame, hot }: SweetConfig = sweetConfig;
  const {
    configFile,
    presets: extraPresets,
    plugins: extraPlugins,
    exclude,
    include
  }: TSOptions = typescript;
  const isDevelopment: boolean = mode === 'development';

  config
    .merge({
      module: {
        rule: {
          [RULE_NAME]: {
            test: /^.*\.(m|c)?tsx?$/i,
            use: {
              'babel-loader': {
                loader: 'babel-loader',
                options: createBabelOptions(sweetOptions)
              },
              'ts-loader': {
                loader: 'ts-loader',
                options: createTypescriptOptions(configFile, sweetOptions.forkTsCheckerWebpackPlugin)
              }
            },
            exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (Array.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  config
    .module
    .rule(RULE_NAME)
    .use('babel-loader')
    .tap((options: LoaderOptions): LoaderOptions => {
      const isReact: boolean = frame === 'react',
        isVue: boolean = frame === 'vue';
      const babelPresets: Array<PluginItem> = [],
        babelPlugins: Array<PluginItem> = [];

      if (Array.isArray(extraPresets)) {
        babelPresets.push(...extraPresets);
      }

      if (Array.isArray(extraPlugins)) {
        babelPlugins.push(...extraPlugins);
      }

      if (isReact && hot) {
        // 判断是否加载react相关插件，热替换
        isDevelopment && babelPlugins.push('react-refresh/babel');
      } else if (isVue) {
        babelPlugins.push('@vue/babel-plugin-jsx'); // 判断是否加载vue相关插件
      }

      return _.mergeWith(options, { presets: babelPresets, plugins: babelPlugins }, customizer);
    });
}