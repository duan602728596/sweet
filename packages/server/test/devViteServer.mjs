import path from 'path';
import { expect } from 'chai';
import milkteaVite from '@sweet-milktea/milktea-vite';
import { metaHelper } from '@sweet-milktea/utils';
import devServer from '../devServer.js';
import { get } from './utils/reqData.mjs';

const { __dirname } = metaHelper(import.meta.url);

// 运行开发环境的vite服务
function runServer(compiler) {
  devServer({
    compiler,
    env: 'test',
    httpPort: 5053,
    vite: true
  });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 7000);
  });
}

describe('development server use vite', function() {
  it('should response status code is 200', async function() {
    const viteDevMiddlewareServer = await milkteaVite.config({
      sweetConfig: {
        frame: 'react',
        vite: {
          root: path.join(__dirname, 'srcVite')
        }
      },
      mode: 'development'
    });

    await runServer(viteDevMiddlewareServer);

    const resHtml = await get('http://127.0.0.1:5053');

    expect(resHtml.statusCode).to.be.equal(200);
  });
});