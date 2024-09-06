import * as path from 'node:path';
import { merge, mergeWithCustomize, mergeWithRules, unique } from 'webpack-merge';
import { isFileExists } from '@sweet-milktea/utils';
import type { Configuration, RuleSetRule, WebpackPluginInstance } from 'webpack';
import type { SweetOptions, TSOptions, WebpackMergeObject } from './types.js';

export const webpackMergeObject: WebpackMergeObject = { merge, mergeWithCustomize, mergeWithRules, unique };

/**
 * 判断tsconfig.json文件是否存在
 * @param { SweetOptions } sweetOptions
 * @param { TSOptions } ts
 */
export function isTsconfigJsonExists(sweetOptions: SweetOptions, ts?: TSOptions): Promise<boolean> {
  const tsconfigJson: string = ts?.configFile ? (
    path.isAbsolute(ts.configFile) ? ts.configFile : path.join(sweetOptions.basicPath, ts.configFile)
  ) : path.join(sweetOptions.basicPath, 'tsconfig.json');

  return isFileExists(tsconfigJson);
}

/* lodash.mergeWith合并函数 */
export function customizer(objValue: unknown, srcValue: unknown): Array<unknown> | undefined {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

/* extensions扩展名 */
export const extensions: Array<string> = [
  '.ts',
  '.tsx',
  '.js',
  '.mjs',
  '.cjs',
  '.mts',
  '.cts',
  '.jsx',
  '.vue',
  '.json',
  '.wasm'
];

/**
 * 添加一个rule
 * @param { Configuration } config
 * @param { RuleSetRule } rule
 */
export function configRulePush(config: Configuration, rule: RuleSetRule): void {
  config.module ??= {};
  config.module.rules ??= [];
  config.module.rules.push(rule);
}

/**
 * 添加一个plugin
 * @param { Configuration } config
 * @param plugin
 */
export function configPluginPush(config: Configuration, plugin: WebpackPluginInstance): void {
  config.plugins ??= [];
  config.plugins.push(plugin);
}