import { expect } from 'chai';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import ImageMinWebpackPlugin from 'imagemin-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';

/* module属性 */
export function expectModule(config, length) {
  return function() {
    expect(config.module).to.be.an('object');
    expect(config.module.rules).to.be.an('array');
    expect(Object.values(config.module.rules)).to.have.lengthOf(length);
  };
}

/* 开发环境 plugins属性 */
export function expectDevPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(5);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[2] instanceof webpack.HotModuleReplacementPlugin).to.be.true;
    expect(config.plugins[3] instanceof HtmlWebpackPlugin).to.be.true;
    expect(config.plugins[4] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 服务器端渲染的开发环境 plugins属性 */
export function expectDevServerPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(4);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[2] instanceof webpack.HotModuleReplacementPlugin).to.be.true;
    expect(config.plugins[3] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 生产环境 plugins属性（含vue插件） */
export function expectProPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(8);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[2] instanceof MiniCssExtractPlugin).to.be.true;
    expect(config.plugins[3] instanceof OptimizeCssAssets).to.be.true;
    expect(config.plugins[4] instanceof ImageMinWebpackPlugin).to.be.true;
    expect(config.plugins[5] instanceof HtmlWebpackPlugin).to.be.true;
    expect(config.plugins[6] instanceof VueLoaderPlugin).to.be.true;
    expect(config.plugins[7] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 服务器端渲染的生产环境 plugins属性（含vue插件） */
export function expectProServerPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(7);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[2] instanceof MiniCssExtractPlugin).to.be.true;
    expect(config.plugins[3] instanceof OptimizeCssAssets).to.be.true;
    expect(config.plugins[4] instanceof ImageMinWebpackPlugin).to.be.true;
    expect(config.plugins[5] instanceof VueLoaderPlugin).to.be.true;
    expect(config.plugins[6] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 开发环境 optimization属性 */
export function expectDevOptimization(config) {
  return function() {
    expect(config.optimization).to.be.undefined;
  };
}

/* 生产环境 optimization属性 */
export function expectProOptimization(config, isServer) {
  return function() {
    expect(config.optimization).to.be.an('object');
    expect(config.optimization.splitChunks).to.eql(isServer ? undefined : { chunks: 'all', automaticNameDelimiter: '.' });
    expect(config.optimization.minimizer[0] instanceof TerserWebpackPlugin).to.be.true;
  };
}

/* optimization属性 */
export function expectOptimization(config, isPro, asyncChunks) {
  return function() {
    expect(config.optimization).to.be.an('object');
    expect(config.optimization.splitChunks).to.eql({ chunks: asyncChunks ? 'async' : 'all', automaticNameDelimiter: '.' });

    if (isPro) {
      expect(config.optimization.minimizer[0] instanceof TerserWebpackPlugin).to.be.true;
    }
  };
}