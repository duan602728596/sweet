/* 生产环境 服务器 */
import * as http from 'http';
import * as http2 from 'http2';
import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import * as Router from '@eggjs/router';
import * as body from 'koa-body';
import * as staticCache from 'koa-static-cache';
import iltorb from './koa-iltorb/index';
import { readFile, defaultRoutersPath, requireModule } from './utils/utils';
import preRender from './utils/preProRender';
import { SweetOptions } from './utils/types';

const app: Koa = new Koa();
const router: Router = new Router();

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/**
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 * serverRoot { string }: 生产环境下的服务器静态文件入口
 * serverRender { boolean }: 开启服务器端渲染
 * serverRenderFile { string }: 服务器端渲染的主模块文件
 */
interface ProServerType {
  httpPort?: number;
  httpsPort?: number;
  serverRoot?: string;
  serverRender?: boolean;
  serverRenderFile?: string;
}

async function proServer(argv: ProServerType = {}): Promise<void> {
  const {
    httpPort = 5052,
    httpsPort = 5053,
    serverRoot = 'build',
    serverRender,
    serverRenderFile = 'buildServer/server.js'
  }: ProServerType = argv;

  /* 将端口加入到服务端 */
  sweetOptions.httpPort = httpPort;
  sweetOptions.httpsPort = httpsPort;

  const formatServerRoot: string = path.isAbsolute(serverRoot)
    ? serverRoot
    : path.join(sweetOptions.basicPath, serverRoot);
  let formatServerRenderFile: string;

  if (serverRender) {
    formatServerRenderFile = path.isAbsolute(serverRenderFile)
      ? serverRenderFile
      : path.join(sweetOptions.basicPath, serverRenderFile);
  }

  /* post body */
  app.use(body());

  /* 文件压缩 */
  app.use(iltorb());

  /* 缓存 */
  app.use(staticCache(formatServerRoot, {
    maxAge: (60 ** 2) * 24 * 365
  }));

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* index路由 */
  router.get(/^\/[^._\-]*$/, async (ctx: Koa.Context, next: Function): Promise<void> => {
    const body: Buffer = await readFile(path.join(formatServerRoot, 'index.html'));

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.body = serverRender ? await preRender(ctx.path, ctx, body, formatServerRenderFile, sweetOptions) : body;

    await next();
  });

  /* 本地服务 */
  if (fs.existsSync(defaultRoutersPath(sweetOptions))) {
    const defaultRouter: string = defaultRoutersPath(sweetOptions);
    const routers: Function = requireModule(defaultRouter);

    routers(router, sweetOptions);
  }

  /* http服务 */
  http.createServer(app.callback())
    .listen(httpPort);

  /* https服务 */
  const key: string = path.join(sweetOptions.basicPath, './server.key');
  const crt: string = path.join(sweetOptions.basicPath, './server.crt');

  if (fs.existsSync(key) && fs.existsSync(crt)) {
    const keyFile: Buffer = await readFile(key);
    const crtFile: Buffer = await readFile(crt);
    const httpsConfig: Object = {
      allowHTTP1: true,
      key: keyFile,
      cert: crtFile
    };

    http2.createSecureServer(httpsConfig, app.callback())
      .listen(httpsPort);
  }
}

export default proServer;