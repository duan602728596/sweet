import path from 'node:path';
import { setTimeout as setTimeoutPromise } from 'node:timers/promises';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import devServer from '../devServer.js';
import createCompiler from './utils/compiler.mjs';
import { get, post } from './utils/reqData.mjs';
import toJson from './utils/toJson.mjs';

const { __dirname } = metaHelper(import.meta.url);

// 运行开发环境服务
async function runServer() {
  // webpack配置
  const compiler = await createCompiler('../srcTs/index.ts');

  devServer({
    compiler,
    env: 'test',
    httpPort: 5051,
    apiFile: path.join(__dirname, 'api/api.js'),
    proxyFile: path.join(__dirname, 'proxy/proxy.js')
  });
  await setTimeoutPromise(15_000);
}

describe('development server use typescript', function() {
  it('should response status code is 200', async function() {
    await runServer();

    const resHtml = await get('http://127.0.0.1:5051');
    const resJs = await get('http://127.0.0.1:5051/index.js');
    const resApi = await get('http://127.0.0.1:5051/api/test', true);
    const resProxyGet = await get('http://127.0.0.1:5051/proxy/test/get?text=test', true);
    const resProxyPost = await post('http://127.0.0.1:5051/proxy/test/post?text=test', {
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