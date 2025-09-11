import * as path from 'node:path';
import CacheConfig from './cacheConfig.js';
import type { SweetOptions } from '../utils/types.js';

/**
 * babel-loader options
 * @param { SweetOptions } sweetOptions
 */
export function createBabelOptions(sweetOptions: SweetOptions): Record<string, any> {
  return {
    cacheDirectory: path.join(sweetOptions.basicPath, CacheConfig.Babel),
    presets: [],
    plugins: [],
    configFile: false,
    babelrc: false
  };
}

/**
 * ts-loader options
 * @param { string | undefined } [configFile]
 * @param { boolean } [forkTsCheckerWebpackPlugin] - sweetOptions.forkTsCheckerWebpackPlugin
 */
export function createTypescriptOptions(configFile?: string, forkTsCheckerWebpackPlugin?: boolean): Record<string, any> {
  const options: Record<string, any> = {
    transpileOnly: forkTsCheckerWebpackPlugin
  };

  if (configFile) {
    options.configFile = configFile;
  }

  return options;
}