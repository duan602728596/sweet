import * as Koa from 'koa';
import * as Router from '@eggjs/router';
import { SweetOptions, Log } from '../utils/types';
import * as body from 'koa-body';
import * as compress from '@bbkkbkk/koa-compress';
import * as staticCache from 'koa-static-cache';
import logs from './logs';

/**
 * 创建中间件
 */
function middleware(
  app: Koa,
  router: Router,
  // 中间件参数
  sweetOptions: SweetOptions,
  log: Log | undefined,
  formatServerRoot: string
): void {
  /* 日志 */
  if (log) {
    logs(app, log, sweetOptions);
  }

  /* post body */
  app.use(body());

  /* 文件压缩 */
  app.use(compress());

  /* 缓存 */
  app.use(staticCache(formatServerRoot, {
    maxAge: (60 ** 2) * 24 * 365,
    filter: (file: string): boolean => !/^.*\.html$/.test(file)
  }));

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());
}

export default middleware;