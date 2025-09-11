import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { Configuration } from 'webpack';
import { createBabelOptions } from '../config/babelConfig.js';
import { customizer, configRulePush } from '../utils/utils.js';
import type { SweetConfig, SweetOptions, JSOptions } from '../utils/types.js';

/* js 配置 */
export default async function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration): Promise<void> {
  const { mode, javascript = {}, frame, hot, webpackLog = 'progress' }: SweetConfig = sweetConfig;
  const {
    ecmascript,
    polyfill,
    presets: extraPresets,
    plugins: extraPlugins,
    exclude,
    include,
    targets: customTargets,
    reactCompiler
  }: JSOptions = javascript;
  const { environment }: SweetOptions = sweetOptions;
  const isDevelopment: boolean = mode === 'development';
  const isEnvServerSideRender: boolean = environment === 'server';
  const debug: boolean = frame === 'test' ? false : isDevelopment;

  // 添加额外的插件
  const isReact: boolean = frame === 'react',
    isVue: boolean = frame === 'vue';
  const babelPresets: Array<[string, any?] | string> = [],
    babelPlugins: Array<[string, any?] | string> = [];

  if (Array.isArray(extraPresets)) {
    babelPresets.push(...extraPresets);
  }

  if (Array.isArray(extraPlugins)) {
    babelPlugins.push(...extraPlugins);
  }

  // babel-preset-sweet
  const babelPresetSweet: any = await requireModule('@sweet-milktea/babel-preset-sweet');
  const babelBuildTargets: object = {
    browsers: ecmascript ? ['last 5 Chrome versions'] : [
      'last 10 versions',
      'last 2 year'
    ]
  };

  babelPresets.push([
    babelPresetSweet,
    {
      env: {
        nodeEnv: isEnvServerSideRender,
        ecmascript,
        targets: customTargets ?? babelBuildTargets,
        debug: (!webpackLog || webpackLog !== 'progress') && debug
      },
      react: {
        use: isReact
      },
      polyfill
    }
  ]);

  if (isReact && hot) {
    isDevelopment && babelPlugins.push('react-refresh/babel'); // 判断是否加载react相关插件，热替换
  } else if (isVue) {
    babelPlugins.push('@vue/babel-plugin-jsx'); // 判断是否加载vue相关插件
  }

  if (isReact && reactCompiler) {
    babelPlugins.push(['babel-plugin-react-compiler', typeof reactCompiler === 'object' ? reactCompiler : {}]);
  }

  configRulePush(config, {
    test: /^.*\.(m|c)?jsx?$/i,
    use: [
      {
        loader: 'babel-loader',
        options: _.mergeWith(createBabelOptions(sweetOptions), {
          targets: babelBuildTargets,
          presets: babelPresets,
          plugins: babelPlugins
        }, customizer)
      }
    ],
    exclude: [
      /\.sweet[\\/]dll[\\/]dll\.js/, // 排除dll文件，dll文件使用asset-modules加载
      /\.ignore\.(m|c)?jsx?/,        // new Worker(new URL('./worker.js', import.meta.url))会被babel编译导致无法解析，添加忽略的文件
      ...(exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [])
    ],
    include: include ? (Array.isArray(include) ? include : [include]) : undefined
  });
}