import * as body from 'koa-body';
import type { Compiler } from 'webpack';
import type * as Koa from 'koa';
import type * as Router from '@koa/router';
import koaDevMiddleware from './koaDevMiddleware';

/**
 * 创建中间件
 * @param { Koa } app: koa实例
 * @param { Router } router: @koa/router实例
 * @param { Compiler } compiler: webpack compiler
 */
function middleware(app: Koa, router: Router, compiler: Compiler | undefined): void {
  /* post body */
  app.use(body());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack热替换服务 */
  if (compiler !== undefined) {
    const devMiddlewareConfig: { [key: string]: any } = {
      serverSideRender: true,
      mimeTypes: {
        avif: 'image/avif',
        avifs: 'image/avif-sequence'
      }
    };

    app.use(koaDevMiddleware(compiler, devMiddlewareConfig));
  }
}

export default middleware;