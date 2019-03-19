import * as _ from 'lodash';
import { RuleSetRule } from 'webpack';

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
export function formatLoader(obj: object | undefined): object {
  if (!obj) return {};

  const formatObj: object = { ...obj };

  if (_.isString(formatObj['use'])) {
    formatObj['use'] = [{ loader: formatObj['use'] }];
  } else if (_.isArray(formatObj['use'])) {
    const use: Array<RuleSetRule> = [];

    for (let i: number = 0, j: number = formatObj['use'].length; i < j; i++) {
      let item: any = formatObj['use'][i];

      if (_.isString(item)) {
        item = { loader: item };
      }

      use.push(item);
    }

    formatObj['use'] = use;
  }



  return formatObj;
}