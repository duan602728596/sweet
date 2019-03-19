import * as _ from 'lodash';
import { RuleSetRule, RuleSetUse } from 'webpack';

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
}

export function customizer(objValue: any, srcValue: any): Array<any> | undefined {
  if (_.isArray(objValue)) {
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
    const use: RuleSetUse = [];

    for (let i: number = 0, j: number = formatObj.use.length; i < j; i++) {
      let item: any = formatObj.use[i];

      if (_.isString(item)) {
        item = { loader: item };
      }

      use.push(item);
    }

    formatObj.use = use;
  }

  if (formatObj.exclude && !_.isArray(formatObj.exclude)) {
    formatObj.exclude = [formatObj.exclude];
  }

  if (formatObj.include && !_.isArray(formatObj.include)) {
    formatObj.include = [formatObj.include];
  }

  return formatObj;
}