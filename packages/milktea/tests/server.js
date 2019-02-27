// @flow
import process from 'process';
import { expect } from 'chai';
import serverConfig from '../lib/server';
import { expectModule, expectDevServerPlugins, expectProServerPlugins, expectDevOptimization, expectProOptimization } from './utils/expectFunction';

const sweetOptions: Object = {
  basicPath: process.cwd()
};

describe('sever-render config', function(): void {
  describe('react & development', function(): void {
    const config: Object = serverConfig({
      serverRender: true,
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function(): void {
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 8));

    it('plugins Configuration is correct', expectDevServerPlugins(config));

    it('optimization Configuration is correct', expectDevOptimization(config));
  });

  describe('vue & production', function(): void {
    const config: Object = serverConfig({
      serverRender: true,
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('config.target and config.node Configuration is correct', function(): void {
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module Configuration is correct', expectModule(config, 9));

    it('plugins Configuration is correct', expectProServerPlugins(config));

    it('optimization Configuration is correct', expectProOptimization(config, true));
  });
});