import { expect } from 'chai';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssets from 'optimize-css-assets-webpack-plugin';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
import TerserPlugin from 'terser-webpack-plugin';

/* devtool属性 */
export function expectDevtool(config: Object, devtool: string): Function{
  return function(): void{
    expect(config.devtool).to.equal(devtool);
  }
}

/* module属性 */
export function expectModule(config: Object, length: number): Function{
  return function(): void{
    expect(config.module).to.be.an('object');
    expect(config.module.rules).to.be.an('array');
    expect(Object.values(config.module.rules)).to.have.lengthOf(length);
  }
}

/* 开发环境 plugins属性 */
export function expectDevPlugins(config: Object): Function{
  return function(): void{
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(2);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof HtmlWebpackPlugin).to.be.true;
  }
}

/* 服务器端渲染的开发环境 plugins属性 */
export function expectDevServerPlugins(config: Object): Function{
  return function(): void{
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(1);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
  }
}

/* 生产环境 plugins属性（含vue插件） */
export function expectProPlugins(config: Object): Function{
  return function(): void{
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(6);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof MiniCssExtractPlugin).to.be.true;
    expect(config.plugins[2] instanceof OptimizeCssAssets).to.be.true;
    expect(config.plugins[3] instanceof webpack.ProgressPlugin).to.be.true;
    expect(config.plugins[4] instanceof HtmlWebpackPlugin).to.be.true;
    expect(config.plugins[5] instanceof VueLoaderPlugin).to.be.true;
  }
}

/* 服务器端渲染的生产环境 plugins属性（含vue插件） */
export function expectProServerPlugins(config: Object): Function{
  return function(): void{
    expect(config.plugins).to.be.an('array');
    expect(config.plugins).to.have.lengthOf(5);
    expect(config.plugins[0] instanceof webpack.IgnorePlugin).to.be.true;
    expect(config.plugins[1] instanceof MiniCssExtractPlugin).to.be.true;
    expect(config.plugins[2] instanceof OptimizeCssAssets).to.be.true;
    expect(config.plugins[3] instanceof webpack.ProgressPlugin).to.be.true;
    expect(config.plugins[4] instanceof VueLoaderPlugin).to.be.true;
  }
}

/* 开发环境 optimization属性 */
export function expectDevOptimization(config: Object): Function{
  return function(): void{
    expect(config.optimization).to.be.eql({});
  }
}

/* 生产环境 optimization属性 */
export function expectProOptimization(config: Object, isServer: boolean): Function{
  return function(): void{
    expect(config.optimization).to.be.an('object');
    expect(config.optimization.splitChunks).to.eql(isServer ? undefined : { chunks: 'all', automaticNameDelimiter: '.' });
    expect(config.optimization.minimizer[0] instanceof TerserPlugin).to.be.true;
  }
}