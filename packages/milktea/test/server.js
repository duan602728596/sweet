import process from 'process';
import { expect } from 'chai';
import serverConfig from '../lib/server';
import { expectModule, expectDevServerPlugins, expectProServerPlugins, expectOptimization } from './utils/expectFunction';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('sever-render config', function() {
  describe('react & development', function() {
    const config = serverConfig({
      serverRender: true,
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.tsx.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function() {
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 10));

    it('plugins Configuration is correct', expectDevServerPlugins(config));

    it('optimization Configuration is correct', expectOptimization(config, false, true));
  });

  describe('vue & production', function() {
    const config = serverConfig({
      serverRender: true,
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.tsx.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function() {
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 11));

    it('plugins Configuration is correct', expectProServerPlugins(config));

    it('optimization Configuration is correct', expectOptimization(config, true, true));
  });
});