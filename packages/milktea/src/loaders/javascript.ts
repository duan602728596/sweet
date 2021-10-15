import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type Config from 'webpack-chain';
import type { LoaderOptions } from 'webpack-chain';
import type { PluginItem, PluginTarget } from '@babel/core';
import { createBabelOptions } from '../config/babelConfig';
import { customizer } from '../utils/utils';
import type { SweetConfig, SweetOptions, JSOptions } from '../utils/types';

const RULE_NAME: string = 'javascript';

/* js 配置 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
  const { mode, javascript = {}, frame, hot, webpackLog = 'progress' }: SweetConfig = sweetConfig;
  const {
    ecmascript,
    polyfill,
    typescript,
    presets: extraPresets,
    plugins: extraPlugins,
    exclude,
    include,
    targets: customTargets
  }: JSOptions = javascript;
  const { environment }: SweetOptions = sweetOptions;
  const isDevelopment: boolean = mode === 'development';
  const isEnvServerSideRender: boolean = environment === 'server';
  const debug: boolean = frame === 'test' ? false : isDevelopment;
  const useTypescript: boolean = !!typescript;

  config
    .merge({
      module: {
        rule: {
          [RULE_NAME]: {
            test: useTypescript ? /^.*\.(m|c)?(j|t)sx?$/i : /^.*\.(m|c)?jsx?$/i,
            use: {
              'babel-loader': {
                loader: 'babel-loader',
                options: createBabelOptions(sweetOptions)
              }
            },
            exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [],
            include: include ? (Array.isArray(include) ? include : [include]) : []
          }
        }
      }
    });

  const babelPresetSweet: PluginTarget = await requireModule('@sweet-milktea/babel-preset-sweet');

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

      babelPresets.push([
        babelPresetSweet,
        {
          env: {
            nodeEnv: isEnvServerSideRender,
            ecmascript,
            targets: customTargets,
            debug: (!webpackLog || webpackLog !== 'progress') && debug
          },
          typescript: {
            use: useTypescript,
            isReact: !isVue
          },
          react: {
            use: isReact
          },
          polyfill
        }
      ]);

      if (isReact && hot) {
        // 判断是否加载react相关插件，热替换
        isDevelopment && babelPlugins.push('react-refresh/babel');
      } else if (isVue) {
        babelPlugins.push('@vue/babel-plugin-jsx'); // 判断是否加载vue相关插件
      }

      return _.mergeWith(options, { presets: babelPresets, plugins: babelPlugins }, customizer);
    });

  config
    .module
    .rule(RULE_NAME)
    .exclude
    .add(/\.sweet[\\/]dll[\\/]dll\.js/) // 排除dll文件，dll文件使用asset-modules加载
    .add(/\.ignore\.(m|c)?jsx?/); // new Worker(new URL('./worker.js', import.meta.url))会被babel编译导致无法解析，添加忽略的文件
}