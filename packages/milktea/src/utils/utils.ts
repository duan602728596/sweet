/* 判断是否为对象 */
export const isObject: Function = (d: any): boolean=>{
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Object]';
};

/* 判断是否为数组 */
export const isArray: Function = (d: any): boolean=>{
  return typeof d === 'object' && Object.prototype.toString.call(d) === '[object Array]';
};

/* @babel/register配置 */
interface RegisterConfig{
  presets: Array<any>;
  plugins: Array<string>;
  cache: boolean;
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
  babelrc: false
};

/* 格式化输出 */
export function handleWebpackBuildProgress(percentage: number, message: any, ...args: any): void{
  const schedule: number = Number(percentage.toFixed(2)) * 100;
  const pNumber: string[] = `${ schedule }`.split('.');

  console.info('\x1B[46m%s\x1B[49m', `${ pNumber[0] }%`, message, ...args);
}

/* 模块导入 */
export function requireModule(id: string): any{
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}