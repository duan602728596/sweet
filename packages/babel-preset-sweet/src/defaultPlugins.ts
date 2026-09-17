import type { PluginItem } from '@babel/core' with { 'resolution-mode': 'import' };
import type { default as BabelPluginProposalDecorators } from '@babel/plugin-proposal-decorators';
import type { default as BabelPluginProposalPipelineOperator } from '@babel/plugin-proposal-pipeline-operator';

type BabelPluginProposalDecoratorsOption = Parameters<typeof BabelPluginProposalDecorators>[1];
type BabelPluginProposalPipelineOperatorOptions = Parameters<typeof BabelPluginProposalPipelineOperator>[1];

/* 默认加载的插件 */
const defaultPlugins: Array<PluginItem> = [
  // async do {} 语法
  '@babel/plugin-proposal-async-do-expressions',
  // class语法
  '@babel/plugin-transform-class-properties',
  // 修饰器
  [
    '@babel/plugin-proposal-decorators',
    { version: '2023-11' } satisfies BabelPluginProposalDecoratorsOption
  ],
  // var { #y: y } = this 语法
  '@babel/plugin-proposal-destructuring-private',
  // do {} 语法
  '@babel/plugin-proposal-do-expressions',
  // using handlerSync = openSync()
  '@babel/plugin-transform-explicit-resource-management',
  // export module from 语法
  '@babel/plugin-proposal-export-default-from',
  // obj::func(val) 语法
  '@babel/plugin-proposal-function-bind',
  // 管道函数
  [
    '@babel/plugin-proposal-pipeline-operator',
    { proposal: 'hack', topicToken: '#' } satisfies BabelPluginProposalPipelineOperatorOptions
  ],
  // var e = throw new Error(err) 语法
  '@babel/plugin-proposal-throw-expressions'
];

export default defaultPlugins;