import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as compress from '@bbkkbkk/koa-compress';
import * as body from 'koa-body';
import * as koaWebpack from 'koa-webpack';
import * as webpack from 'webpack';
import createKoaWebpack from './createKoaWebpack';

/**
 * 创建中间件
 */
async function middleware(
  app: Koa,
  router: Router,
  // createKoaWebpack
  compiler: webpack.Compiler | undefined,
  env: string | undefined,
  useHttps: boolean,
  keyFile: Buffer | undefined,
  certFile: Buffer | undefined
): Promise<void> {
  /* 文件压缩 */
  app.use(compress({
    useBrCompress: false // 关闭brotli压缩
  }));

  /* post body */
  app.use(body());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack中间件 */
  const koaWebpackMiddleware: koaWebpack.Middleware<any> = await createKoaWebpack(compiler, env, useHttps, keyFile, certFile);

  app.use(koaWebpackMiddleware);
}

export default middleware;