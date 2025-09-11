import { requireModule } from '@sweet-milktea/utils';
import type { SweetOptions } from './types.js';

interface RegisterConfig {
  presets: Array<[string, any?] | string>;
  cache: boolean;
  ignore: Array<RegExp>;
  extensions: Array<string>;
  configFile: boolean;
  babelrc: boolean;
}

/* 使用@babel/register */
async function useRegister(sweetOptions: SweetOptions): Promise<void> {
  if (sweetOptions.useBabelRegister) {
    const config: RegisterConfig = {
      presets: [
        [
          await requireModule('@sweet-milktea/babel-preset-sweet'),
          {
            env: {
              nodeEnv: true,
              ecmascript: true,
              modules: 'commonjs'
            },
            typescript: {
              use: true
            }
          }
        ]
      ],
      cache: true,
      ignore: [/node_modules/],
      extensions: ['.ts', '.tsx', '.mts', '.cts', '.js', '.mjs', '.cjs', '.jsx'],
      configFile: false,
      babelrc: false
    };

    // 如果开启了ssr，要把编译后的目录加入到忽略列表，否则会影响性能
    if (sweetOptions.serverRenderRoot) {
      config.ignore.push(new RegExp(sweetOptions.serverRenderRoot, 'ig'));
    }

    (await requireModule('@babel/register'))(config);
  }
}

export default useRegister;