import * as path from 'path';
import { SweetOptions } from './types';

interface RegisterConfig {
  presets: Array<any>;
  plugins: Array<any>;
  cache: boolean;
  ignore: Array<RegExp>;
}

function createRegisterConfig(): RegisterConfig {
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
    cache: true,
    ignore: [
      /node_modules/
    ]
  };
}

function useRegister(sweetOptions: SweetOptions): void {
  if (sweetOptions.useBabelRegister) {
    const register: Function = require('@babel/register');
    const config: RegisterConfig = createRegisterConfig();

    if (sweetOptions.serverRenderFile) {
      const result: path.ParsedPath = path.parse(sweetOptions.serverRenderFile);

      config.ignore.push(new RegExp(result.dir, 'ig'));
    }

    register(config);
  }
}

export default useRegister;