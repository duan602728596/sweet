import process from 'process';
import { expect } from 'chai';
import webpack from 'webpack';
import webpackDll from '../lib/dll';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('dll', function() {
  describe('dll', function() {
    const config = webpackDll({ mode: 'development' }, sweetOptions);

    it('module Configuration is correct', function() {
      expect(config.module).to.be.an('object');
      expect(config.module.rules).to.be.an('array');
    });

    it('plugins Configuration is correct', function() {
      expect(config.plugins).to.be.an('array');
      expect(config.plugins[0] instanceof webpack.DllPlugin).to.be.true;
      expect(config.plugins[1] instanceof webpack.IgnorePlugin).to.be.true;
      expect(config.plugins[2] instanceof webpack.ProgressPlugin).to.be.true;
    });
  });
});