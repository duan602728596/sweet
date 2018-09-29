import { expect } from 'chai';
import serverConfig from '../src/server';
import {
  expectDevtool, expectModule, expectDevPlugins, expectProPlugins, expectDevOptimization, expectProOptimization
} from './utils/expectFunction';

describe('sever config配置', function(): void{
  describe('react & development', function(): void{
    const config: Object = serverConfig({
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    });

    it('target & node', function(): void{
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('devtool', expectDevtool(config, 'module-source-map'));

    it('module', expectModule(config, 8));

    it('plugins', expectDevPlugins(config));

    it('optimization', expectDevOptimization(config));
  });

  describe('vue & production', function(): void{
    const config: Object = serverConfig({
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    });

    it('target & node', function(): void{
      expect(config.target).to.equal('node');
      expect(config.node).to.eql({ __filename: true, __dirname: true });
    });

    it('devtool', expectDevtool(config, 'none'));

    it('module', expectModule(config, 9));

    it('plugins', expectProPlugins(config));

    it('optimization', expectProOptimization(config, true));
  });
});