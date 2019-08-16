/* 生产环境 服务器 */
import * as http from 'http';
import * as http2 from 'http2';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import middleware from './proServer/middleware';
import createRouters from './proServer/createRouters';
import portUse from './proServer/portUse';
import createApi from './utils/createApi';
import createHttpsCertificate, { HttpsCertificate } from './utils/createHttpsCertificate';
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
 * httpsKey { string }: https的key的地址
 * httpsCert { string }: https的cert的地址
 * useBabelRegister { boolean }: 是否使用@babel/register，用来优化性能
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
  httpsKey?: string;
  httpsCert?: string;
  useBabelRegister?: boolean;
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
    serverChain,
    httpsKey = 'server.key',
    httpsCert = 'server.crt',
    useBabelRegister = true
  }: ProServerType = argv;

  /* 合并配置项 */
  Object.assign(sweetOptions, {
    httpPort: await portUse(httpPort, 'http'),
    httpsPort: await portUse(httpsPort, 'https'),
    renderType,
    serverRenderFile,
    useBabelRegister
  });

  /* https服务 */
  const [useHttps, keyFile, certFile]: HttpsCertificate = await createHttpsCertificate(sweetOptions, httpsKey, httpsCert);

  /* 获取文件夹地址 */
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
  createApi(sweetOptions, router, app, false);

  /* http服务 */
  http
    .createServer(app.callback())
    .listen(sweetOptions.httpPort);

  /* https服务 */
  if (useHttps && keyFile && certFile) {
    const httpsConfig: object = {
      allowHTTP1: true,
      key: keyFile,
      cert: certFile
    };

    http2
      .createSecureServer(httpsConfig, app.callback())
      .listen(sweetOptions.httpsPort);
  }
}

export default proServer;