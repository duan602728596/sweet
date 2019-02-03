import process from 'process';
import { expect } from 'chai';
import webpack from 'webpack';
import webpackDll from '../lib/dll';
import { expectDevtool } from './utils/expectFunction';

const sweetOptions: Object = {
  basicPath: process.cwd()
};

describe('dll', function(): void{
  describe('dll', function(): void{
    const config: Object = webpackDll({ mode: 'development' }, sweetOptions);

    it('devtool', expectDevtool(config, 'module-source-map'));

    it('module', function(): void{
      expect(config.module).to.be.an('object');
      expect(config.module.rules).to.be.an('array');
    });

    it('plugins', function(): void{
      expect(config.plugins).to.be.an('array');
      expect(config.plugins[0] instanceof webpack.DllPlugin).to.be.true;
      expect(config.plugins[1] instanceof webpack.IgnorePlugin).to.be.true;
      expect(config.plugins[2] instanceof webpack.ProgressPlugin).to.be.true;
    });
  });
});