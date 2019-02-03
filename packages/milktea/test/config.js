import process from 'process';
import { expect } from 'chai';
import webpackConfig from '../lib/config';
import {
  expectDevtool, expectModule, expectDevPlugins, expectProPlugins, expectDevOptimization, expectProOptimization
} from './utils/expectFunction';

const sweetOptions: object = {
  basicPath: process.cwd()
};

describe('config', function(): void{
  describe('react & development', function(): void{
    const config: object = webpackConfig({
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('devtool', expectDevtool(config, 'module-source-map'));

    it('module', expectModule(config, 8));

    it('plugins', expectDevPlugins(config));

    it('optimization', expectDevOptimization(config));
  });

  describe('vue & production', function(): void{
    const config: object = webpackConfig({
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('devtool', expectDevtool(config, 'none'));

    it('module', expectModule(config, 9));

    it('plugins', expectProPlugins(config));

    it('optimization', expectProOptimization(config, false));
  });
});