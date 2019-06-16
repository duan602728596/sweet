import { expect } from 'chai';
import devServer from '../devServer';
import createCompiler from './compiler';
import reqData from './reqData';

// webpack配置
const compiler = createCompiler();

// 运行开发环境服务
function runServer() {
  devServer({
    compiler,
    env: 'test'
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 15000);
  });
}

describe('development server', function() {
  it('should response status code is 200', async function() {
    await runServer();

    // 请求文件
    const resHtml = await reqData('http://127.0.0.1:5050');
    const resJs = await reqData('http://127.0.0.1:5050/index.js');

    expect(resHtml.statusCode).to.be.equal(200);
    expect(resJs.statusCode).to.be.equal(200);
  });
});