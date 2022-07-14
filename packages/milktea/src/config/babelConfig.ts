import * as path from 'node:path';
import type { LoaderOptions } from 'webpack-chain';
import CacheConfig from './cacheConfig';
import type { SweetOptions } from '../utils/types';

/**
 * babel-loader options
 * @param { SweetOptions } sweetOptions
 */
export function createBabelOptions(sweetOptions: SweetOptions): LoaderOptions {
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
 * @param { string | undefined } configFile
 * @param { boolean } forkTsCheckerWebpackPlugin: sweetOptions.forkTsCheckerWebpackPlugin
 */
export function createTypescriptOptions(configFile?: string, forkTsCheckerWebpackPlugin?: boolean): LoaderOptions {
  const options: LoaderOptions = {
    transpileOnly: forkTsCheckerWebpackPlugin
  };

  if (configFile) {
    options.configFile = configFile;
  }

  return options;
}