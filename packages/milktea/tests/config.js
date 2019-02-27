// @flow
import process from 'process';
import { expect } from 'chai';
import webpackConfig from '../lib/config';
import { expectModule, expectDevPlugins, expectProPlugins, expectDevOptimization, expectProOptimization } from './utils/expectFunction';

const sweetOptions: Object = {
  basicPath: process.cwd()
};

describe('config', function(): void {
  describe('react & development', function(): void {
    const config: Object = webpackConfig({
      frame: 'react',
      mode: 'development',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('module Configuration is correct', expectModule(config, 8));

    it('plugins Configuration is correct', expectDevPlugins(config));

    it('optimization Configuration is correct', expectDevOptimization(config));
  });

  describe('vue & production', function(): void {
    const config: Object = webpackConfig({
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('module Configuration is correct', expectModule(config, 9));

    it('plugins Configuration is correct', expectProPlugins(config));

    it('optimization Configuration is correct', expectProOptimization(config, false));
  });
});