/* 生产环境 服务器 */
import http from 'http';
import http2 from 'http2';
import fs from 'fs';
import process from 'process';
import path from 'path';
import zlib from 'zlib';
import Koa from 'koa';
import Router from 'koa-router';
import body from 'koa-body';
import convert from 'koa-convert';
import compress from 'koa-compress';
import staticCache from 'koa-static-cache';
import mime from 'mime-types';
import { readFile, defaultRoutersPath, registerConfig } from './utils/utils';
import preRender from './utils/preProRender';

const app: Koa = new Koa();
const router: Router = new Router();

/* 基础配置 */
const sweetOptions: {
  basicPath: string
} = {
  basicPath: process.cwd() // 主目录
};

/**
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 * serverRoot { ?string }: 生产环境下的服务器静态文件入口
 * serverRender { boolean }: 开启服务器端渲染
 * serverRenderFile { string }: 服务器端渲染的主模块文件
 */
type proServerType = {
  httpPort: number,
  httpsPort: number,
  serverRoot: string,
  serverRender: boolean,
  serverRenderFile: string
};

async function proServer(argv: Object = {}): Promise<void>{
  const {
    httpPort = 5052,
    httpsPort = 5053,
    serverRoot = 'build',
    serverRender,
    serverRenderFile = 'build/server.js'
  }: proServerType = argv;
  const cwd: string = process.cwd();
  const formatServerRoot: string = path.isAbsolute(serverRoot) ? serverRoot : path.join(cwd, serverRoot);
  let formatServerRenderFile: ?string = null;

  if(serverRender){
    formatServerRenderFile = path.isAbsolute(serverRenderFile) ? serverRenderFile : path.join(cwd, serverRenderFile);
  }

  /* post body */
  app.use(body());

  /* gzip压缩 */
  app.use(compress({
    filter(contentType: string): boolean{
      return true;
    },
    threshold: 2048,
    flush: zlib.constants.Z_SYNC_FLUSH
  }));

  /* 缓存 */
  app.use(convert(
    staticCache(formatServerRoot, {
      maxAge: (60 ** 2) * 24 * 365
    })
  ));

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* index路由 */
  router.get(/^\/[^._\-]*$/, async(ctx: Object, next: Function): Promise<void>=>{
    const body: ArrayBuffer = await readFile(path.join(formatServerRoot, 'index.html'));

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.body = serverRender ? await preRender(ctx.path, ctx, body, formatServerRenderFile, sweetOptions) : body;

    await next();
  });

  /* 静态文件 */
  router.get(/^.*\.[a-zA-Z0-9]+$/, async(ctx: Object, next: Function): Promise<void>=>{
    const pathFile: string = ctx.path;
    const file: string = path.join(formatServerRoot, pathFile);

    if(fs.existsSync(file)){
      ctx.status = 200;
      ctx.type = mime.lookup(file);
      ctx.body = await readFile(file);
    }else{
      ctx.status = 404;
    }

    await next();
  });

  /* 本地服务 */
  if(fs.existsSync(defaultRoutersPath(sweetOptions))){
    // 加载es6+环境
    const register: Function = require('@babel/register');
    const p: string = defaultRoutersPath(sweetOptions);

    register(registerConfig);

    const routers: Object | Function = require(p);

    if('default' in routers) routers.default(router, sweetOptions);
    else routers(router, sweetOptions);
  }

  /* http服务 */
  http.createServer(app.callback())
    .listen(httpPort);

  /* https服务 */
  const key: string = path.join(cwd, './server.key');
  const crt: string = path.join(cwd, './server.crt');

  if(fs.existsSync(key) && fs.existsSync(crt)){
    const keyString: string | ArrayBuffer = await readFile(key);
    const crtString: string | ArrayBuffer = await readFile(crt);
    const httpsConfig: Object = {
      allowHTTP1: true,
      key: keyString,
      cert: crtString
    };

    http2.createSecureServer(httpsConfig, app.callback())
      .listen(httpsPort);
  }
}

export default proServer;