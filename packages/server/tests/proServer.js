import path from 'path';
import { expect } from 'chai';
import proServer from '../proServer';
import createCompiler from './utils/compiler';
import { get, post } from './utils/reqData';
import toJson from './utils/toJson';

// webpack配置
const compiler = createCompiler('../src/index.js');

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
    env: 'test',
    serverRoot: 'tests/dist',
    httpPort: 5052,
    httpsPort: 5053,
    apiFile: path.join(__dirname, 'api/api.js'),
    proxyFile: path.join(__dirname, 'proxy/proxy.js')
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

    const resHtml = await get('http://127.0.0.1:5052');
    const resJs = await get('http://127.0.0.1:5052/index.js');
    const resApi = await get('http://127.0.0.1:5052/api/test', true);
    const resProxyGet = await get('http://127.0.0.1:5052/proxy/test/get?text=test', true);
    const resProxyPost = await post('http://127.0.0.1:5052/proxy/test/post?text=test', {
      text: 'test'
    });
    const resMock0 = await get('http://127.0.0.1:5050/mock/api/test/0');
    const resMock1 = await get('http://127.0.0.1:5050/mock/api/test/1');
    const resMock2 = await post('http://127.0.0.1:5050/mock/api/test/2');
    const resMock3 = await post('http://127.0.0.1:5050/mock/api/test/3');

    expect(resHtml.statusCode).to.be.equal(200);
    expect(resJs.statusCode).to.be.equal(200);
    expect(resApi.data).to.be.eql({
      name: 'test',
      method: 'get'
    });
    expect(resProxyGet.data).to.be.eql({
      query: 'test',
      method: 'get'
    });
    expect(resProxyPost.data).to.be.eql({
      body: 'test',
      method: 'post'
    });
    expect(resMock0.data).to.be.equal('test0');
    expect(toJson(resMock1.data)).to.be.eql({
      name: 'get',
      value: 1
    });
    expect(toJson(resMock2.data)).to.be.eql({
      name: 'post',
      value: 2
    });
    expect(toJson(resMock3.data)).to.be.eql({
      name: 'post',
      value: 3
    });
  });
});