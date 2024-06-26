import { expect } from 'chai';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import VueLoaderPlugin from 'vue-loader/dist/plugin.js';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import WebpackBar from 'webpackbar';

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
    expect(config.plugins).to.have.lengthOf(7);
    expect(config.plugins[0] instanceof MiniCssExtractPlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[2] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[3] instanceof webpack.HotModuleReplacementPlugin).to.be.true;
    expect(config.plugins[4] instanceof ReactRefreshWebpackPlugin).to.be.true;
    expect(config.plugins[5] instanceof HtmlWebpackPlugin).to.be.true;
    expect(config.plugins[6] instanceof WebpackBar || config.plugins[6] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 服务器端渲染的开发环境 plugins属性 */
export function expectDevServerPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(3);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[2] instanceof WebpackBar || config.plugins[2] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 生产环境 plugins属性（含vue插件） */
export function expectProPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(6);
    expect(config.plugins[0] instanceof MiniCssExtractPlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[2] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[3] instanceof HtmlWebpackPlugin).to.be.true;
    expect(config.plugins[4] instanceof VueLoaderPlugin.default).to.be.true;
    expect(config.plugins[5] instanceof WebpackBar || config.plugins[5] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* 服务器端渲染的生产环境 plugins属性（含vue插件） */
export function expectProServerPlugins(config) {
  return function() {
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(4);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof webpack.DefinePlugin).to.be.true;
    expect(config.plugins[2] instanceof VueLoaderPlugin.default).to.be.true;
    expect(config.plugins[3] instanceof WebpackBar || config.plugins[3] instanceof webpack.ProgressPlugin).to.be.true;
  };
}

/* optimization属性 */
export function expectOptimization(config, isPro, asyncChunks) {
  return function() {
    expect(config.optimization).to.be.an('object');
    expect(config.optimization.splitChunks).to.eql({
      chunks: asyncChunks ? 'async' : 'all',
      automaticNameDelimiter: '.',
      minChunks: 2
    });

    if (isPro) {
      expect(config.optimization.minimizer[0] instanceof TerserWebpackPlugin).to.be.true;
      expect(config.optimization.minimizer[1] instanceof CssMinimizerPlugin).to.be.true;
    }
  };
}