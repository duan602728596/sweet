/* 判断是否为对象 */

export function isObject<Data>(data: Data): boolean {
  return typeof data === 'object' && Object.prototype.toString.call(data) === '[object Object]';
}

/* 判断是否为数组 */
export function isArray<Data>(data: Data): boolean {
  return typeof data === 'object' && Object.prototype.toString.call(data) === '[object Array]';
}

/* @babel/register配置 */
interface RegisterConfig {
  presets: Array<any>;
  plugins: Array<any>;
  cache: boolean;
  configFile: boolean;
  babelrc: boolean;
}

export const registerConfig: RegisterConfig = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['node 9']
        },
        debug: false,
        modules: 'commonjs',
        useBuiltIns: 'usage'
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-optional-chaining'
  ],
  configFile: false,
  cache: false,
  babelrc: false
};

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}