import process from 'node:process';
import { expect } from 'chai';
import serverConfig from '../esm/server.js';
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
    const config = await serverConfig({
      serverRender: true,
      frame: 'react',
      mode: 'development',
      typescript: { forkTsCheckerWebpackPlugin: false },
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('[sever-render config - react & development] config.target and config.node Configuration is correct',
      function() {
        expect(config.target).to.eql(['node', 'node22']);
        expect(config.node).to.eql({ __filename: true, __dirname: true });
      });

    it('[sever-render config - react & development] module Configuration is correct', expectModule(config, 10));

    it('[sever-render config - react & development] plugins Configuration is correct', expectDevServerPlugins(config));

    it('[sever-render config - react & development] optimization Configuration is correct',
      expectOptimization(config, false, true));
  });

  describe('vue & production', async function() {
    const config = await serverConfig({
      serverRender: true,
      frame: 'vue',
      mode: 'production',
      typescript: { forkTsCheckerWebpackPlugin: false },
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('[sever-render config - vue & production] config.target and config.node Configuration is correct',
      function() {
        expect(config.target).to.eql(['node', 'node22']);
        expect(config.node).to.eql({ __filename: true, __dirname: true });
      });

    it('[sever-render config - vue & production] module Configuration is correct', expectModule(config, 11));

    it('[sever-render config - vue & production] plugins Configuration is correct', expectProServerPlugins(config));

    it('[sever-render config - vue & production] optimization Configuration is correct',
      expectOptimization(config, true, true));
  });
});