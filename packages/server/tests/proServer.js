import { expect } from 'chai';
import axios from 'axios';
import proServer from '../lib/proServer';
import createCompiler from './compiler';

// webpack配置
const compiler = createCompiler();

// 编译文件
function runBuild() {
  compiler.run(() => undefined);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 15000);
  });
}

// 运行生产环境服务
function runServer() {
  proServer({
    serverRoot: 'tests/build'
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

describe('production server', function() {
  it('should response status code is 200', async function() {
    await runBuild();
    await runServer();

    // 请求文件
    const resHtml = await axios.get('http://127.0.0.1:5052');
    const resJs = await axios.get('http://127.0.0.1:5052/index.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});