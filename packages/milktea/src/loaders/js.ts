import * as path from 'path';
import * as _ from 'lodash';
import { RuleSetCondition } from 'webpack';
import * as Config from 'webpack-chain';
import { Use } from 'webpack-chain';
import { customizer } from '../utils/utils';
import { SweetConfig, SweetOptions } from '../utils/types';

interface Js {
  ecmascript?: boolean;
  presets?: Array<any>;
  plugins?: Array<any>;
  resetPresets?: Array<any>;
  resetPlugins?: Array<any>;
  exclude?: RuleSetCondition;
  include?: RuleSetCondition;
}

const basicPlugins: Array<any> = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],
  '@babel/plugin-proposal-class-properties',
  '@babel/plugin-proposal-do-expressions',
  '@babel/plugin-proposal-optional-catch-binding',
  '@babel/plugin-proposal-export-default-from',
  '@babel/plugin-proposal-optional-chaining',
  '@babel/plugin-syntax-dynamic-import'
];

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
  const _js: Js = js || {};
  const { ecmascript, presets, plugins, resetPresets, resetPlugins, exclude, include }: Js = _js;
  const debug: boolean = frame === 'test' ? false : (isDevelopment === undefined ? true : isDevelopment);

  config.merge({
    module: {
      rule: {
        js: {
          test: /^.*\.jsx?$/,
          use: {
            'babel-loader': {
              loader: 'babel-loader',
              options: {
                cacheDirectory: path.join(sweetOptions.basicPath, '.babelCache'),
                presets: resetPresets ? resetPresets : [],
                plugins: resetPlugins ? resetPlugins : [
                  ...basicPlugins,
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      corejs: false,
                      helpers: true,
                      regenerator: !ecmascript,
                      useESModules: true
                    }
                  ]
                ],
                configFile: false,
                babelrc: false
              }
            }
          },
          exclude: exclude ? (_.isArray(exclude) ? exclude : [exclude]) : [],
          include: include ? (_.isArray(include) ? include : [include]) : []
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
          .tap((options: any): any => _.mergeWith(options, {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    ie: 11,
                    edge: 16,
                    chrome: 62,
                    firefox: 56,
                    android: 6,
                    ios: 11
                  },
                  debug,
                  modules: false,
                  useBuiltIns: 'usage'
                }
              ]
            ]
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
            plugins: resetPlugins ? undefined : ['transform-vue-jsx']
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
}