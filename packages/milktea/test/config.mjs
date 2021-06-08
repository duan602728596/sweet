import process from 'process';
import webpackConfig from '../lib/config.js';
import { expectModule, expectDevPlugins, expectProPlugins, expectOptimization } from './utils/expectFunction.mjs';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('config', function() {
  describe('react & development', async function() {
    const config = await webpackConfig.default({
      frame: 'react',
      mode: 'development',
      loader: {
        js: {
          test: /.*\.jsx?/,
          use: ['babel-loader', 'ts-loader']
        }
      },
      html: [{ template: 'index.tsx.pug' }],
      hot: true
    }, sweetOptions);

    it('module Configuration is correct', expectModule(config, 10));

    it('plugins Configuration is correct', expectDevPlugins(config));

    it('optimization Configuration is correct', expectOptimization(config));
  });

  describe('vue & production', async function() {
    const config = await webpackConfig.default({
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.tsx.pug' }],
      hot: true
    }, sweetOptions);

    it('module Configuration is correct', expectModule(config, 11));

    it('plugins Configuration is correct', expectProPlugins(config));

    it('optimization Configuration is correct', expectOptimization(config, true));
  });
});