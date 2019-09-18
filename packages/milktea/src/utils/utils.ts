import { RuleSetRule, RuleSetUse } from 'webpack';

/* 模块导入 */
export function requireModule(id: string): any {
  const module: { default: any } | any = require(id);

  return 'default' in module ? module.default : module;
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
    const use: RuleSetUse = [];

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