/* 开发环境 服务器 */
import http from 'http';
import http2 from 'http2';
import fs from 'fs';
import process from 'process';
import path from 'path';
import Koa from 'koa';
import Router from 'koa-router';
import mime from 'mime-types';
import koaWebpack from 'koa-webpack';
import { readFile } from './utils/file';

const app: Object = new Koa();
const router: Object = new Router();

/**
 * compiler { Object }: webpack的compiler
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 */
type devServerType = {
  compiler: Object,
  httpPort: number,
  httpsPort: number
};

async function devServer({ compiler, httpPort = 5050, httpsPort = 5051 }: devServerType): Promise<void>{
  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack中间件 */
  const middleware: Function = await koaWebpack({
    compiler,
    hotClient: {
      host: {
        client: '*',
        server: '0.0.0.0'
      },
      port: 65050
    }
  });

  app.use(middleware);

  /* webpack 重定向 */
  router.get(/^\/[^._\-]*$/, async(ctx: Object, next: Function): Promise<void>=>{
    const file: string = ctx.path;
    const mimeType: string = mime.lookup(file);
    if(file !== '/' && mimeType === false){
      ctx.path = '/';
      ctx._path = file;
    }
    await next();
  });

  /* http服务 */
  http.createServer(app.callback())
    .listen(httpPort);

  /* https服务 */
  const cwd: string = process.cwd();
  const key: string = path.join(cwd, '../dev.key');
  const crt: string = path.join(cwd, '../dev.crt');

  // 判断是否有证书
  if(fs.existsSync(key) && fs.existsSync(crt)){
    const keyString: string | ArrayBuffer = await readFile(key);
    const crtString: string | ArrayBuffer = await readFile(crt);
    const httpsConfig: Object = {
      allowHTTP1: true,
      key: keyString,
      cert: crtString
    };

    http2.createSecureServer(httpsConfig, app.callback()).listen(httpsPort);
  }
}

export default devServer;