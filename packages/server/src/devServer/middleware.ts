import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as compress from '@bbkkbkk/koa-compress';
import * as body from 'koa-body';
import * as connect from 'koa-connect';
import { Compiler } from 'webpack';
import * as hotMiddleware from 'webpack-hot-middleware';
import koaDevMiddleware from './koaDevMiddleware';
import { webpackHmrPath } from '../utils/utils';
import { WebpackLog } from '../utils/types';

/**
 * 创建中间件
 */
function middleware(app: Koa, router: Router, compiler: Compiler | undefined, webpackLog: WebpackLog | undefined, env: string | undefined): void {
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
      path: webpackHmrPath
    },
      devMiddlewareConfig: { [key: string]: any } = {
        publicPath: compiler?.options?.output?.publicPath ?? '/',
        serverSideRender: true
      };

    // webpack log
    if (!webpackLog || webpackLog === 'progress') {
      devMiddlewareConfig.logLevel = 'warn';
      devMiddlewareConfig.stats = {
        colors: true,
        assets: false,
        entrypoints: false,
        builtAt: false,
        hash: false,
        modules: false,
        version: false,
        timings: false
      };
    }

    // 测试配置
    if (env === 'test') {
      hotMiddlewareConfig.log = false;
      devMiddlewareConfig.logLevel = 'silent';
    }

    app.use(connect(
      hotMiddleware(compiler, hotMiddlewareConfig)
    ));

    app.use(koaDevMiddleware(compiler, devMiddlewareConfig));
  }
}

export default middleware;