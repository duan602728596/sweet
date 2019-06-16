import { expect } from 'chai';
import proServer from '../proServer';
import createCompiler from './utils/compiler';
import reqData from './utils/reqData';

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
    serverRoot: 'tests/dist'
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
    const resHtml = await reqData('http://127.0.0.1:5052');
    const resJs = await reqData('http://127.0.0.1:5052/index.js');

    expect(resHtml.statusCode).to.be.equal(200);
    expect(resJs.statusCode).to.be.equal(200);
  });
});