import { expect } from 'chai';
import webpack from 'webpack';
import axios from 'axios';
import proServer from '../lib/proServer';
import createCompiler from './compiler';

// webpack配置
const compiler: webpack.Compiler = createCompiler();

// 编译文件
function runBuild(): Promise<void> {
  compiler.run((): void => undefined);

  return new Promise((resolve: Function, reject: Function): void => {
    setTimeout((): void => {
      resolve();
    }, 15000);
  });
}

// 运行生产环境服务
function runServer(): Promise<void> {
  proServer({
    serverRoot: 'tests/build'
  });

  return new Promise((resolve: Function, reject: Function): void => {
    setTimeout((): void => {
      resolve();
    }, 3000);
  });
}

describe('production server', function(): void {
  it('should response status code is 200', async function(): Promise<void> {
    await runBuild();
    await runServer();

    // 请求文件
    const resHtml: object = await axios.get('http://127.0.0.1:5052');
    const resJs: object = await axios.get('http://127.0.0.1:5052/index.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});