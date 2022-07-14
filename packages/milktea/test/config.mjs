import process from 'node:process';
import webpackConfig from '../esm/config.js';
import { expectModule, expectDevPlugins, expectProPlugins, expectOptimization } from './utils/expectFunction.mjs';

const sweetOptions = {
  basicPath: process.cwd(),
  typescript: {
    forkTsCheckerWebpackPlugin: false
  }
};

describe('config', function() {
  describe('react & development', async function() {
    const config = await webpackConfig({
      frame: 'react',
      mode: 'development',
      typescript: { forkTsCheckerWebpackPlugin: false },
      html: [{ template: 'index.pug' }],
      hot: true
    }, sweetOptions);

    it('[config - react & development] module Configuration is correct', expectModule(config, 10));

    it('[config - react & development] plugins Configuration is correct', expectDevPlugins(config));

    it('[config - react & development] optimization Configuration is correct', expectOptimization(config));
  });

  describe('vue & production', async function() {
    const config = await webpackConfig({
      frame: 'vue',
      mode: 'production',
      typescript: { forkTsCheckerWebpackPlugin: false },
      html: [{ template: 'index.pug' }],
      hot: true
    }, sweetOptions);

    it('[config - vue & production] module Configuration is correct', expectModule(config, 11));

    it('[config - vue & production] plugins Configuration is correct', expectProPlugins(config));

    it('[config - vue & production] optimization Configuration is correct', expectOptimization(config, true));
  });
});