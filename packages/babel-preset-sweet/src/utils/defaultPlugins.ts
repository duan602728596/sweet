import type { PluginItem } from '@babel/core';

/* 默认加载的插件 */
const defaultPlugins: Array<PluginItem> = [
  // async do {} 语法
  '@babel/plugin-proposal-async-do-expressions',
  // 修饰器
  ['@babel/plugin-proposal-decorators', { version: '2023-05' }],
  // var { #y: y } = this 语法
  '@babel/plugin-proposal-destructuring-private',
  // do {} 语法
  '@babel/plugin-proposal-do-expressions',
  // using handlerSync = openSync()
  '@babel/plugin-proposal-explicit-resource-management',
  // export module from 语法
  '@babel/plugin-proposal-export-default-from',
  // obj::func(val) 语法
  '@babel/plugin-proposal-function-bind',
  // 管道函数
  ['@babel/plugin-proposal-pipeline-operator', { proposal: 'hack', topicToken: '#' }],
  // var e = throw new Error(err) 语法
  '@babel/plugin-proposal-throw-expressions',
  // import json from './foo.json' with { type: 'json' }
  ['@babel/plugin-syntax-import-assertions', { deprecatedAssertSyntax: true }]
];

export default defaultPlugins;