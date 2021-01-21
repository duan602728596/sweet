import process from 'process';
import { expect } from 'chai';
import webpack from 'webpack';
import webpackDllConfig from '../lib/dll';

const sweetOptions = {
  basicPath: process.cwd()
};

describe('dll', function() {
  describe('dll', function() {
    const config = webpackDllConfig({ mode: 'development' }, sweetOptions);

    it('plugins Configuration is correct', function() {
      expect(config.plugins).to.be.an('array');
      expect(config.plugins).to.have.lengthOf(3);
      expect(config.plugins[0] instanceof webpack.DllPlugin).to.be.true;
      expect(config.plugins[1] instanceof webpack.IgnorePlugin).to.be.true;
      expect(config.plugins[2] instanceof webpack.ProgressPlugin).to.be.true;
    });
  });
});