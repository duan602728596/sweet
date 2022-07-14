import path from 'node:path';
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import proServer from '../proServer.js';
import createCompiler from './utils/compiler.mjs';
import { get, post } from './utils/reqData.mjs';
import toJson from './utils/toJson.mjs';
import afterTest from './afterTest.mjs';

const { __dirname } = metaHelper(import.meta.url);

// 编译文件
async function runBuild() {
  // webpack配置
  const compiler = await createCompiler('../src/index.js', 'production');

  compiler.run(() => undefined);
  await setTimeoutPromise(15_000);
}

// 运行生产环境服务
function runServer() {
  proServer({
    env: 'test',
    serverRoot: 'test/dist',
    httpPort: 5060,
    httpsPort: 5061,
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

    const resHtml = await get('http://127.0.0.1:5060');
    const resJs = await get('http://127.0.0.1:5060/index.js');
    const resApi = await get('http://127.0.0.1:5060/api/test', true);
    const resProxyGet = await get('http://127.0.0.1:5060/proxy/test/get?text=test', true);
    const resProxyPost = await post('http://127.0.0.1:5060/proxy/test/post?text=test', {
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

  after(afterTest);
});