import process from 'process';
import { expect } from 'chai';
import serverConfig from '../lib/server';
import { expectModule, expectDevServerPlugins, expectProServerPlugins, expectDevOptimization, expectProOptimization } from './utils/expectFunction';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('sever-render config', function() {
  describe('react & development', function() {
    const config = serverConfig({
      serverRender: true,
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function() {
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 8));

    it('plugins Configuration is correct', expectDevServerPlugins(config));

    it('optimization Configuration is correct', expectDevOptimization(config));
  });

  describe('vue & production', function() {
    const config = serverConfig({
      serverRender: true,
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function() {
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 9));

    it('plugins Configuration is correct', expectProServerPlugins(config));

    it('optimization Configuration is correct', expectProOptimization(config, true));
  });
});