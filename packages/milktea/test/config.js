import { expect } from 'chai';
import webpackConfig from '../src/config';
import {
  expectDevtool, expectModule, expectDevPlugins, expectProPlugins, expectDevOptimization, expectProOptimization
} from './utils/expectFunction';

describe('config配置', function(): void{
  describe('react & development', function(): void{
    const config: Object = webpackConfig({
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    });

    it('devtool', expectDevtool(config, 'module-source-map'));

    it('module', expectModule(config, 8));

    it('plugins', expectDevPlugins(config));

    it('optimization', expectDevOptimization(config));
  });

  describe('vue & production', function(): void{
    const config: Object = webpackConfig({
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    });

    it('devtool', expectDevtool(config, 'none'));

    it('module', expectModule(config, 9));

    it('plugins', expectProPlugins(config));

    it('optimization', expectProOptimization(config, false));
  });
});