import _ from 'lodash';
import { moduleExists } from '@sweet-milktea/utils';
import type { Configuration } from 'webpack';
import type { PluginItem } from '@babel/core';
import { customizer, configRulePush } from '../utils/utils.js';
import { createBabelOptions, createTypescriptOptions } from '../config/babelConfig.js';
import type { SweetConfig, SweetOptions, TSOptions } from '../utils/types.js';

/* ts 配置 */
export default function(sweetConfig: SweetConfig, sweetOptions: SweetOptions, config: Configuration): void {
  const { mode, typescript = {}, frame, hot }: SweetConfig = sweetConfig;
  const {
    configFile,
    presets: extraPresets,
    plugins: extraPlugins,
    exclude,
    include,
    reactCompiler
  }: TSOptions = typescript;
  const isDevelopment: boolean = mode === 'development';

  // 添加额外的插件
  const isReact: boolean = frame === 'react',
    isVue: boolean = frame === 'vue';
  const babelPresets: Array<PluginItem> = [],
    babelPlugins: Array<PluginItem> = [];

  // TODO: 如果开启了react-compiler，必须保证jsx是原始输入，需要后续使用babel来编译jsx
  if (isReact && reactCompiler) {
    babelPresets.push([
      '@babel/preset-react',
      {
        runtime: (moduleExists('react/jsx-runtime') ? 'automatic' : 'classic'),
        development: isDevelopment
      }
    ]);
  }

  if (Array.isArray(extraPresets)) {
    babelPresets.push(...extraPresets);
  }

  if (Array.isArray(extraPlugins)) {
    babelPlugins.push(...extraPlugins);
  }

  if (isReact && hot) {
    isDevelopment && babelPlugins.push('react-refresh/babel'); // 判断是否加载react相关插件，热替换
  } else if (isVue) {
    babelPlugins.push('@vue/babel-plugin-jsx'); // 判断是否加载vue相关插件
  }

  if (isReact && reactCompiler) {
    babelPlugins.push(['babel-plugin-react-compiler', typeof reactCompiler === 'object' ? reactCompiler : {}]);
  }

  configRulePush(config, {
    test: /^.*\.(m|c)?tsx?$/i,
    use: [
      {
        loader: 'babel-loader',
        options: _.mergeWith(createBabelOptions(sweetOptions), { presets: babelPresets, plugins: babelPlugins }, customizer)
      },
      {
        loader: 'ts-loader',
        options: createTypescriptOptions(configFile, sweetOptions.forkTsCheckerWebpackPlugin)
      }
    ],
    exclude: exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : undefined,
    include: include ? (Array.isArray(include) ? include : [include]) : undefined
  });
}