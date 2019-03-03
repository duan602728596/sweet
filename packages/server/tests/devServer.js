import { expect } from 'chai';
import webpack from 'webpack';
import axios from 'axios';
import devServer from '../lib/devServer';
import createCompiler from './compiler';

// webpack配置
const compiler: webpack.Compiler = createCompiler();

// 运行开发环境服务
function runServer(): Promise<void> {
  devServer({
    compiler,
    env: 'test'
  });

  return new Promise((resolve: Function, reject: Function): void => {
    setTimeout((): void => {
      resolve();
    }, 15000);
  });
}

describe('development server', function(): void {
  it('should response status code is 200', async function(): Promise<void> {
    await runServer();

    // 请求文件
    const resHtml: object = await axios.get('http://127.0.0.1:5050');
    const resJs: object = await axios.get('http://127.0.0.1:5050/index.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});