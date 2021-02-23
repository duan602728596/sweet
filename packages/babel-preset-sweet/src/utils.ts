/* 默认加载的插件 */
export const defaultPlugins: Array<any> = [
  ['@babel/plugin-proposal-decorators', { legacy: true }],               // 修饰器
  '@babel/plugin-proposal-class-static-block',                           // class static块
  '@babel/plugin-proposal-class-properties',                             // class 相关
  '@babel/plugin-proposal-do-expressions',                               // do {} 语法
  '@babel/plugin-proposal-export-default-from',                          // export module from 语法
  '@babel/plugin-proposal-export-namespace-from',                        // export * as module from 语法
  '@babel/plugin-proposal-numeric-separator',                            // 数字分隔符
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }], // 管道函数
  '@babel/plugin-proposal-throw-expressions',                            // var e = throw new Error(err) 语法
  '@babel/plugin-syntax-module-string-names',                            // import { 'unicode' as bar } and export { foo as 'unicode' }
  '@babel/plugin-syntax-top-level-await'                                 // top-level await
];

/* 判断模块是否存在 */
export function moduleExists(id: string): string | false {
  try {
    return require.resolve(id);
  } catch (err) {
    return false;
  }
}

/**
 * 模块版本检查
 * @param { string } version: 当前版本
 * @param { number } minimumVersion: 最小版本
 */
export function versionCheck(version: string, minimumVersion: number): boolean {
  const middleVersion: number = Number(version.split(/\./)[1]);

  return middleVersion >= minimumVersion;
}

/**
 * @param { object } obj
 * @param { Array<string> } delKeys
 */
export function omit(obj: object, delKeys: Array<string>): object {
  const shallowCopy: object = Object.assign({}, obj);

  for (const delKey of delKeys) {
    delete shallowCopy[delKey];
  }

  return shallowCopy;
}