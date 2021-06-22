/* 默认加载的插件 */
const defaultPlugins: Array<any> = [
  '@babel/plugin-proposal-async-do-expressions',  // async do {} 语法
  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }], // 修饰器
  '@babel/plugin-proposal-class-static-block',    // class static块
  '@babel/plugin-proposal-class-properties',      // class 相关
  '@babel/plugin-proposal-do-expressions',        // do {} 语法
  '@babel/plugin-proposal-export-default-from',   // export module from 语法
  '@babel/plugin-proposal-export-namespace-from', // export * as module from 语法
  '@babel/plugin-proposal-function-bind',         // obj::func(val) 语法
  '@babel/plugin-proposal-numeric-separator',     // 数字分隔符
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }], // 管道函数
  '@babel/plugin-proposal-throw-expressions',     // var e = throw new Error(err) 语法
  '@babel/plugin-syntax-module-string-names',     // import { 'unicode' as bar } and export { foo as 'unicode' }
  '@babel/plugin-syntax-top-level-await'          // top-level await
];

export default defaultPlugins;