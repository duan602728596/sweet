import * as path from 'path';
import type { LoaderOptions } from 'webpack-chain';
import { babelCache } from './cacheConfig';
import type { SweetOptions } from '../utils/types';

/**
 * babel-loader options
 * @param { SweetOptions } sweetOptions
 */
export function createBabelOptions(sweetOptions: SweetOptions): LoaderOptions {
  return {
    cacheDirectory: path.join(sweetOptions.basicPath, babelCache),
    presets: [],
    plugins: [],
    configFile: false,
    babelrc: false
  };
}

/**
 * ts-loader options
 * @param { string | undefined } configFile
 * @param { boolean } forkTsCheckerWebpackPlugin
 */
export function createTypescriptOptions(configFile?: string, forkTsCheckerWebpackPlugin?: boolean): LoaderOptions {
  const options: LoaderOptions = {
    transpileOnly: forkTsCheckerWebpackPlugin !== false
  };

  if (configFile) {
    options.configFile = configFile;
  }

  return options;
}