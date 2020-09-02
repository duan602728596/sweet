import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as body from 'koa-body';
import * as compress from 'koa-compress';
import * as staticCache from 'koa-static-cache';
import logs from './logs';
import createRewriteMime from './createRewriteMime';
import type { SweetOptions } from '../utils/types';

/**
 * 创建中间件
 * @param { Koa } app: koa实例
 * @param { Router } router: @koa/router实例
 * @param { SweetOptions } sweetOptions: 配置
 */
function middleware(app: Koa, router: Router, sweetOptions: SweetOptions): void {
  /* 日志 */
  if (sweetOptions.log) {
    logs(app, sweetOptions.log, sweetOptions);
  }

  /* post body */
  app.use(body());

  /* 文件压缩 */
  app.use(compress({}));

  /* avif */
  app.use(createRewriteMime({
    avif: 'image/avif',
    avifs: 'image/avif-sequence'
  }));

  /* 缓存 */
  app.use(staticCache(sweetOptions.serverRoot, {
    maxAge: (60 ** 2) * 24 * 365,
    filter: (file: string): boolean => !/^.*\.html$/.test(file)
  }));

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());
}

export default middleware;