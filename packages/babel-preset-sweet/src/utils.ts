/* 默认加载的插件 */
export const defaultPlugins: Array<any> = [
  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }], // 修饰器
  '@babel/plugin-proposal-class-static-block',                             // class static块
  '@babel/plugin-proposal-class-properties',                               // class 相关
  '@babel/plugin-proposal-do-expressions',                                 // do {} 语法
  '@babel/plugin-proposal-export-default-from',                            // export module from 语法
  '@babel/plugin-proposal-export-namespace-from',                          // export * as module from 语法
  '@babel/plugin-proposal-numeric-separator',                              // 数字分隔符
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],   // 管道函数
  '@babel/plugin-proposal-throw-expressions',                              // var e = throw new Error(err) 语法
  '@babel/plugin-syntax-module-string-names',                              // import { 'unicode' as bar } and export { foo as 'unicode' }
  '@babel/plugin-syntax-top-level-await'                                   // top-level await
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
 * 模块版本检查是否大于等于指定的最小版本号
 * @param { string } version: 当前版本
 * @param { Array<number> } minimumVersion: 最小版本
 */
export function versionCheck(version: string, minimumVersion: Array<number>): boolean {
  const middleVersion: Array<string> = version.split(/\./);
  let result: boolean = true;

  for (let i: number = 0, j: number = minimumVersion.length; i < j; i++) {
    const lVer: number = Number(middleVersion[i]);
    const rVer: number = minimumVersion[i];

    if (lVer !== rVer) {
      result = lVer > rVer;
      break;
    }
  }

  return result;
}