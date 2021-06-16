import _ from 'lodash';
import type Config from 'webpack-chain';
import type { LoaderOptions } from 'webpack-chain';
import { requireModule } from '@sweet-milktea/utils';
import { createBabelOptions } from '../config/babelConfig';
import { customizer } from '../utils/utils';
import type { SweetConfig, SweetOptions, JSOptions } from '../utils/types';

/* js 配置 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Config): Promise<void> {
  const { mode, javascript = {}, frame, hot, webpackLog = 'progress' }: SweetConfig = sweetConfig;
  const {
    ecmascript,
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
          js: {
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

  const babelPresetSweet: any = await requireModule('@sweet-milktea/babel-preset-sweet');

  config
    .module
    .rule('js')
    .use('babel-loader')
    .tap((options: LoaderOptions): LoaderOptions => {
      const isReact: boolean = frame === 'react',
        isVue: boolean = frame === 'vue';
      const babelPresets: Array<any> = [],
        babelPlugins: Array<any> = [];

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
          }
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

  // 排除dll文件，dll文件使用file-loader加载
  config
    .module
    .rule('js')
    .exclude
    .add(/\.sweet[\\/]dll[\\/]dll\.js/);
}