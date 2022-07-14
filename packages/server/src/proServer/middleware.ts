import body from 'koa-body';
import compress from 'koa-compress';
import serve from 'koa-static';
import type Koa from 'koa';
import type Router from '@koa/router';
import logs from './logs.js';
import createRewriteMime from './createRewriteMime.js';
import type { SweetOptions } from '../utils/types.js';

/**
 * 创建中间件
 * @param { Koa } app: koa实例
 * @param { Router } router: @koa/router实例
 * @param { SweetOptions } sweetOptions: 配置
 */
async function middleware(app: Koa, router: Router, sweetOptions: SweetOptions): Promise<void> {
  /* 日志 */
  if (sweetOptions.log) {
    await logs(app, sweetOptions.log, sweetOptions);
  }

  /* post body */
  app.use(body());

  /* 文件压缩 */
  app.use(compress());

  /* avif */
  app.use(createRewriteMime({
    avifs: 'image/avif-sequence'
  }));

  /* 静态资源 */
  app.use(serve(sweetOptions.serverRoot, {
    maxage: (60 ** 2) * 24 * 365 * 1_000,
    index: false
  }));

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());
}

export default middleware;