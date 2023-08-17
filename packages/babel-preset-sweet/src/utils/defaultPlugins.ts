import type { PluginItem } from '@babel/core';

/* 默认加载的插件 */
const defaultPlugins: Array<PluginItem> = [
  '@babel/plugin-proposal-async-do-expressions',  // async do {} 语法
  ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }], // 修饰器
  '@babel/plugin-proposal-destructuring-private', // var { #y: y } = this 语法
  '@babel/plugin-proposal-do-expressions',        // do {} 语法
  '@babel/plugin-proposal-explicit-resource-management', // using handlerSync = openSync()
  '@babel/plugin-proposal-export-default-from',   // export module from 语法
  '@babel/plugin-proposal-function-bind',         // obj::func(val) 语法
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'hack', topicToken: '#' }], // 管道函数
  '@babel/plugin-proposal-throw-expressions',     // var e = throw new Error(err) 语法
  ['@babel/plugin-syntax-import-assertions', { deprecatedAssertSyntax: true }] // import json from './foo.json' with { type: 'json' }
];

export default defaultPlugins;