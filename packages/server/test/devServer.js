import path from 'path';
import { expect } from 'chai';
import axios from 'axios';
import webpack from 'webpack';
import { config as webpackConfig } from '@sweet/milktea';
import devServer from '../lib/devServer';

// webpack配置
const compiler: Object = webpack(webpackConfig({
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
}, 'development'));

// 运行开发环境服务
function runServer(): Promise{
  devServer({
    compiler,
    env: 'test'
  });

  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 15000);
  });
}

describe('development server', function(): void{
  it('run dev server', async function(): Promise<void>{
    await runServer();

    // 请求文件
    const resHtml: Object = await axios.get('http://127.0.0.1:5050');
    const resJs: Object = await axios.get('http://127.0.0.1:5050/app.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});