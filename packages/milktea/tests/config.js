import process from 'process';
import { expect } from 'chai';
import webpackConfig from '../lib/config';
import {
  expectModule, expectDevPlugins, expectProPlugins, expectDevOptimization, expectProOptimization
} from './utils/expectFunction';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('config', function() {
  describe('react & development', function() {
    const config = webpackConfig({
      frame: 'react',
      mode: 'development',
      loader: {
        js: {
          test: /.*\.jsx?/,
          use: ['babel-loader', 'ts-loader']
        }
      },
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('module Configuration is correct', expectModule(config, 9));

    it('plugins Configuration is correct', expectDevPlugins(config));

    it('optimization Configuration is correct', expectDevOptimization(config));
  });

  describe('vue & production', function() {
    const config = webpackConfig({
      frame: 'vue',
      mode: 'production',
      html: [{ template: 'index.pug' }]
    }, sweetOptions);

    it('module Configuration is correct', expectModule(config, 10));

    it('plugins Configuration is correct', expectProPlugins(config));

    it('optimization Configuration is correct', expectProOptimization(config, false));
  });
});