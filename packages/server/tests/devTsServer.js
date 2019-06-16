import { expect } from 'chai';
import devServer from '../devServer';
import createCompiler from './utils/compiler';
import reqData from './utils/reqData';

// webpack配置
const compiler = createCompiler('../srcTs/index.ts');

// 运行开发环境服务
function runServer() {
  devServer({
    compiler,
    env: 'test',
    httpPort: 5051
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 15000);
  });
}

describe('development server use typescript', function() {
  it('should response status code is 200', async function() {
    await runServer();

    // 请求文件
    const resHtml = await reqData('http://127.0.0.1:5051');
    const resJs = await reqData('http://127.0.0.1:5051/index.js');

    expect(resHtml.statusCode).to.be.equal(200);
    expect(resJs.statusCode).to.be.equal(200);
  });
});