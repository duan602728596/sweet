import * as path from 'path';
import { SweetOptions } from './types';

function registerConfig(sweetOptions: SweetOptions): object {
  return {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: ['node 9']
          },
          debug: false,
          modules: 'commonjs',
          useBuiltIns: false
        }
      ]
    ],
    plugins: [
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-optional-catch-binding',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-syntax-bigint',
      '@babel/plugin-syntax-dynamic-import'
    ],
    cache: path.join(sweetOptions.basicPath, '.sweet/cache/register')
  };
}

export default registerConfig;