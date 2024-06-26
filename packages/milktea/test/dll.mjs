import process from 'node:process';
import { expect } from 'chai';
import webpack from 'webpack';
import webpackDllConfig from '../esm/dll.js';

const sweetOptions = {
  basicPath: process.cwd(),
  typescript: {
    forkTsCheckerWebpackPlugin: false
  }
};

describe('dll', async function() {
  const config = await webpackDllConfig({
    mode: 'development',
    typescript: { forkTsCheckerWebpackPlugin: false }
  }, sweetOptions);

  it('[dll] plugins Configuration is correct', function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(3);
    expect(config.plugins[0] instanceof webpack.DllPlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[2] instanceof webpack.ProgressPlugin).to.be.true;
  });
});