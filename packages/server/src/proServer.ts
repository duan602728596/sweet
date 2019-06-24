/* 生产环境 服务器 */
import * as http from 'http';
import * as http2 from 'http2';
import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import { Context } from 'koa';
import * as Router from '@eggjs/router';
import * as register from '@babel/register';
import middleware from './proServer/middleware';
import createRouters from './proServer/createRouters';
import registerConfig from './utils/registerConfig';
import { readFile, defaultApiPath, requireModule } from './utils/utils';
import { SweetOptions, Log } from './utils/types';

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
 * template { string }: html模版名称
 * renderType { string }: html使用的渲染模板
 * log { object }: 日志配置
 * serverChain { (app: Koa) => void }: 扩展koa中间件配置
 */
interface ProServerType {
  httpPort?: number;
  httpsPort?: number;
  serverRoot?: string;
  serverRender?: boolean;
  serverRenderFile?: string;
  template?: string;
  renderType?: 'ejs' | 'nunjucks';
  log?: Log;
  serverChain?: (app: Koa) => void;
}

async function proServer(argv: ProServerType = {}): Promise<void> {
  const {
    httpPort = 80,
    httpsPort = 443,
    serverRoot = 'dist',
    serverRender,
    serverRenderFile = 'dist-server/server.js',
    template = 'index.html',
    renderType = 'ejs',
    log,
    serverChain
  }: ProServerType = argv;

  /* 合并配置项 */
  Object.assign(sweetOptions, {
    httpPort,
    httpsPort,
    renderType
  });

  const formatServerRoot: string = path.isAbsolute(serverRoot)
    ? serverRoot
    : path.join(sweetOptions.basicPath, serverRoot);
  let formatServerRenderFile: string = '';

  if (serverRender) {
    formatServerRenderFile = path.isAbsolute(serverRenderFile)
      ? serverRenderFile
      : path.join(sweetOptions.basicPath, serverRenderFile);
  }

  /* 扩展koa中间件配置 */
  if (serverChain) {
    await serverChain(app);
  }

  middleware(app, router, sweetOptions, log, formatServerRoot);

  createRouters(router, sweetOptions, !!serverRender, formatServerRenderFile, formatServerRoot, template);

  /* 本地api */
  if (fs.existsSync(defaultApiPath(sweetOptions.basicPath))) {
    register(registerConfig(sweetOptions));

    const defaultApi: string = defaultApiPath(sweetOptions.basicPath);
    const routers: Function = requireModule(defaultApi);

    routers(router, sweetOptions, app);
  }

  /* http服务 */
  http.createServer(app.callback())
    .listen(httpPort);

  /* https服务 */
  const key: string = path.join(sweetOptions.basicPath, 'server.key');
  const crt: string = path.join(sweetOptions.basicPath, 'server.crt');

  if (fs.existsSync(key) && fs.existsSync(crt)) {
    const keyFile: Buffer = await readFile(key);
    const crtFile: Buffer = await readFile(crt);
    const httpsConfig: Object = {
      allowHTTP1: true,
      key: keyFile,
      cert: crtFile
    };

    http2
      .createSecureServer(httpsConfig, app.callback())
      .listen(httpsPort);
  }
}

export default proServer;