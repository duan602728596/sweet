import { expect } from 'chai';
import axios from 'axios';
import devServer from '../lib/devServer';
import createCompiler from './compiler';

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
    const resHtml = await axios.get('http://127.0.0.1:5050');
    const resJs = await axios.get('http://127.0.0.1:5050/index.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});