// @flow
import path from 'path';
import { expect } from 'chai';
import axios from 'axios';
import webpack from 'webpack';
import { config as webpackConfig } from '@sweet/milktea';
import proServer from '../lib/proServer';

// webpack配置
const compiler: Object = webpack(webpackConfig({
  frame: 'test',
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
}, 'development')); // TODO: 生产环境下编译会卡进程，导致无法输出文件，所以将"production"改为"development"

// 编译文件
function runBuild(): Promise<void>{
  compiler.run((): void => undefined);

  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 15000);
  });
}

// 运行生产环境服务
function runServer(): Promise<void>{
  proServer({
    serverRoot: 'test/build'
  });

  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 3000);
  });
}

describe('production server', function(): void{
  it('run pro server', async function(): Promise<void>{
    await runBuild();
    await runServer();

    // 请求文件
    const resHtml: Object = await axios.get('http://127.0.0.1:5052');
    const resJs: Object = await axios.get('http://127.0.0.1:5052/app.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});