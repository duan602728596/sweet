// @flow
import process from 'process';
import { expect } from 'chai';
import serverConfig from '../lib/server';
import { expectModule, expectDevServerPlugins, expectProServerPlugins, expectDevOptimization, expectProOptimization } from './utils/expectFunction';

const sweetOptions: Object = {
  basicPath: process.cwd()
};

describe('sever-render config', function(): void{
  describe('react & development', function(): void{
    const config: Object = serverConfig({
      serverRender: true,
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('target & node', function(): void{
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module', expectModule(config, 8));

    it('plugins', expectDevServerPlugins(config));

    it('optimization', expectDevOptimization(config));
  });

  describe('vue & production', function(): void{
    const config: Object = serverConfig({
      serverRender: true,
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('target & node', function(): void{
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('module', expectModule(config, 9));

    it('plugins', expectProServerPlugins(config));

    it('optimization', expectProOptimization(config, true));
  });
});