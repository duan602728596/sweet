import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as compress from '@bbkkbkk/koa-compress';
import * as body from 'koa-body';
import * as connect from 'koa-connect';
import { Compiler } from 'webpack';
import * as hotMiddleware from 'webpack-hot-middleware';
import koaDevMiddleware from './koaDevMiddleware';
import { webpackHmrPath } from '../utils/utils';

/**
 * 创建中间件
 * @param { Koa } app: koa实例
 * @param { Router } router: @koa/router实例
 * @param { Compiler } compiler: webpack compiler
 */
function middleware(app: Koa, router: Router, compiler: Compiler | undefined): void {
  /* 文件压缩 */
  app.use(compress({
    useBrCompress: false // 关闭brotli压缩
  }));

  /* post body */
  app.use(body());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack热替换服务 */
  if (compiler !== undefined) {
    const hotMiddlewareConfig: { [key: string]: any } = {
      path: webpackHmrPath,
      log: false
    };
    const devMiddlewareConfig: { [key: string]: any } = {
      serverSideRender: true
    };

    app.use(connect(
      hotMiddleware(compiler, hotMiddlewareConfig)
    ));

    app.use(koaDevMiddleware(compiler, devMiddlewareConfig));
  }
}

export default middleware;