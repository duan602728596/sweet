import process from 'node:process';
import { expect } from 'chai';
import serverConfig from '../lib/server.js';
import {
  expectModule,
  expectDevServerPlugins,
  expectProServerPlugins,
  expectOptimization
} from './utils/expectFunction.mjs';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('sever-render config', function() {
  describe('react & development', async function() {
    const config = await serverConfig.default({
      serverRender: true,
      frame: 'react',
      mode: 'development',
      typescript: { forkTsCheckerWebpackPlugin: false },
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function() {
      expect(config.target).to.eql(['node', 'node10']);
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 10));

    it('plugins Configuration is correct', expectDevServerPlugins(config));

    it('optimization Configuration is correct', expectOptimization(config, false, true));
  });

  describe('vue & production', async function() {
    const config = await serverConfig.default({
      serverRender: true,
      frame: 'vue',
      mode: 'production',
      typescript: { forkTsCheckerWebpackPlugin: false },
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function() {
      expect(config.target).to.eql(['node', 'node10']);
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 11));

    it('plugins Configuration is correct', expectProServerPlugins(config));

    it('optimization Configuration is correct', expectOptimization(config, true, true));
  });
});