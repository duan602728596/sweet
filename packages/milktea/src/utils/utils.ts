import * as path from 'path';
import * as fs from 'fs';
import type { RuleSetRule } from 'webpack';
import type { SweetOptions, TS } from './types';

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

/* 判断模块是否存在 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

type JudgeFunc = <T>(f: number) => boolean;

/**
 * 根据模块版本返回不同的值
 * @param { string } id: 模块id
 * @param { JudgeFunc } judgeFunc: 判断条件
 * @param { T } fillReturn: 满足的时候返回
 * @param { T } notFillReturn: 不满足的时候返回
 */
export function versionReturn<T>(id: string, judgeFunc: JudgeFunc, fillReturn: T, notFillReturn: T): T | undefined {
  if (moduleExists(id) === false) return;

  const { version }: { version: string } = requireModule(`${ id }/package.json`);
  const firstVersion: number = Number(version.split(/\./g)[0]);

  if (judgeFunc(firstVersion)) {
    return fillReturn;
  } else {
    return notFillReturn;
  }
}

/**
 * 判断tsconfig.json文件是否存在
 * @param { SweetOptions } sweetOptions
 * @param { TS } ts
 */
export function isTsconfigJsonExists(sweetOptions: SweetOptions, ts?: TS): boolean {
  const tsconfigJson: string = ts?.configFile ? (
    path.isAbsolute(ts.configFile) ? ts.configFile : path.join(sweetOptions.basicPath, ts.configFile)
  ) : path.join(sweetOptions.basicPath, 'tsconfig.json');

  return fs.existsSync(tsconfigJson);
}

/* lodash.mergeWith合并函数 */
export function customizer(objValue: any, srcValue: any): Array<any> | undefined {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/* 格式化loader的配置项 */
export function formatLoader(obj: RuleSetRule | undefined): RuleSetRule {
  if (!obj) return {};

  const formatObj: RuleSetRule = obj ? { ...obj } : {};

  if (formatObj.use && typeof formatObj.use === 'string') {
    formatObj.use = [{ loader: formatObj.use }];
  } else if (formatObj.use && Array.isArray(formatObj.use)) {
    const use: Array<any> = [];

    for (let i: number = 0, j: number = formatObj.use.length; i < j; i++) {
      let item: any = formatObj.use[i];

      if (typeof item === 'string') {
        item = { loader: item };
      }

      use.push(item);
    }

    formatObj.use = use;
  }

  if (formatObj.exclude && !Array.isArray(formatObj.exclude)) {
    formatObj.exclude = [formatObj.exclude];
  }

  if (formatObj.include && !Array.isArray(formatObj.include)) {
    formatObj.include = [formatObj.include];
  }

  return formatObj;
}

/* extensions扩展名 */
export const extensions: Array<string> = ['.js', '.jsx', '.mjs', 'cjs', '.json', '.wasm', '.ts', '.tsx', '.vue'];