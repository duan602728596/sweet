// @flow
import { expect } from 'chai';
import axios from 'axios';
import devServer from '../lib/devServer';
import createCompiler from './compiler';

// webpack配置
const compiler: Object = createCompiler();

// 运行开发环境服务
function runServer(): Promise<void>{
  devServer({
    compiler,
    env: 'test'
  });

  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 15000);
  });
}

describe('development server', function(): void{
  it('run dev server', async function(): Promise<void>{
    await runServer();

    // 请求文件
    const resHtml: Object = await axios.get('http://127.0.0.1:5050');
    const resJs: Object = await axios.get('http://127.0.0.1:5050/app.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});