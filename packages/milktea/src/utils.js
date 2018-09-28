/* 判断是否为对象 */
export const isObject: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Object]';

/* 判断是否为数组 */
export const isArray: Function = (d: any): boolean => typeof d === 'object' && Object.prototype.toString.call(d) === '[object Array]';

/* @babel/register配置 */
export const registerConfig: Object = {
  presets: [
    [
      '@babel/preset-env',
      {
        'targets': {
          'browsers': ['node 6']
        },
        'debug': false,
        'modules': 'commonjs',
        'useBuiltIns': 'usage'
      }
    ],
    '@babel/preset-flow'
  ],
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-do-expressions',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-class-properties'
  ],
  cache: false,
  babelrc: false,
  only: [/\.sweetrc\.js/]
};

/* 格式化输出 */
export function handleWebpackBuildProgress(percentage: number, message: any, ...args: any): void{
  const pNumber: string[] = `${ percentage.toFixed(2) * 100 }`.split('.');

  console.info('\x1B[46m%s\x1B[49m', `${ pNumber[0] }%`, message, ...args);
}