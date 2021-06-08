import { expect } from 'chai';
import { config } from '../lib/milktea-vite.js';

describe('config', function() {
  it('the config function returns the middlewares of a server', async function() {
    const viteDevMiddlewareServer = await config({
      sweetConfig: {},
      mode: 'development'
    });

    expect(viteDevMiddlewareServer).to.be.an('object');
    expect(viteDevMiddlewareServer.middlewares).to.be.an('function');
  });
});