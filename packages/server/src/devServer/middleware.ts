import * as body from 'koa-body';
import connect = require('koa-connect');
import type { Compiler } from 'webpack';
import type { ViteDevServer } from 'vite';
import type * as Koa from 'koa';
import type * as Router from '@koa/router';
import koaDevMiddleware from './koaDevMiddleware';
import type { SweetOptions } from '../utils/types';

/**
 * 创建中间件
 * @param { SweetOptions } sweetOptions
 * @param { Koa } app: koa实例
 * @param { Router } router: @koa/router实例
 * @param { Compiler } compiler: webpack compiler
 */
function middleware(sweetOptions: SweetOptions, app: Koa, router: Router, compiler: Compiler | ViteDevServer | undefined): void {
  /* post body */
  app.use(body());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  if (compiler !== undefined) {
    if (sweetOptions.vite) {
      // vite服务
      app.use(connect((compiler as ViteDevServer).middlewares));
    } else {
      // webpack热替换服务
      const devMiddlewareConfig: { [key: string]: any } = {
        serverSideRender: true,
        mimeTypes: {
          avif: 'image/avif',
          avifs: 'image/avif-sequence'
        }
      };

      app.use(koaDevMiddleware(compiler as Compiler, devMiddlewareConfig));
    }
  }
}

export default middleware;