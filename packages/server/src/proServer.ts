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
import createProxy from './utils/createProxy';
import createSweetOptionsMiddleware from './utils/createOptions';
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
 * env { string }: 运行环境，可能的值为test（测试）
 * template { string }: html模版名称
 * renderType { string }: html使用的渲染模板
 * log { object }: 日志配置
 * serverChain { (app: Koa) => void }: 扩展koa中间件配置
 * httpsKey { string }: https的key的地址
 * httpsCert { string }: https的cert的地址
 * useBabelRegister { boolean }: 是否使用@babel/register，用来优化性能
 * controllersDir { string }: 重新定义的controllers的目录
 * routerFile { string }: 重新定义的router文件
 * apiFile { string }: 重新定义的api文件
 * proxyFile { string }: 重新定义的proxy文件
 */
interface ProServerType {
  httpPort?: number;
  httpsPort?: number;
  serverRoot?: string;
  serverRender?: boolean;
  serverRenderFile?: string;
  env?: string;
  template?: string;
  renderType?: 'ejs' | 'nunjucks';
  log?: Log;
  serverChain?: (app: Koa) => void;
  httpsKey?: string;
  httpsCert?: string;
  useBabelRegister?: boolean;
  controllersDir?: string;
  apiFile?: string;
  proxyFile?: string;
}

async function proServer(argv: ProServerType = {}): Promise<void> {
  const {
    httpPort = 80,
    httpsPort = 443,
    serverRoot = 'dist',
    serverRender,
    serverRenderFile = 'dist-server/server.js',
    env,
    template = 'index.html',
    renderType = 'ejs',
    log,
    serverChain,
    httpsKey = 'server.key',
    httpsCert = 'server.crt',
    useBabelRegister = true,
    controllersDir,
    apiFile,
    proxyFile
  }: ProServerType = argv;

  /* 合并配置项 */
  Object.assign(sweetOptions, {
    httpPort: await portUse(httpPort, 'http'),
    httpsPort: await portUse(httpsPort, 'https'),
    renderType,
    serverRenderFile,
    useBabelRegister,
    controllersDir,
    apiFile,
    proxyFile
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

  /* sweetOptions */
  createSweetOptionsMiddleware(app, sweetOptions);

  /* 添加代理服务 */
  await createProxy(sweetOptions, app, false, env);

  /* 扩展koa中间件配置 */
  if (serverChain) {
    await serverChain(app);
  }

  /* 添加其他的中间件 */
  middleware(app, router, sweetOptions, log, formatServerRoot);

  /* 创建路由 */
  createRouters(router, sweetOptions, !!serverRender, formatServerRenderFile, formatServerRoot, template);

  /* 本地api */
  await createApi(sweetOptions, router, app, false);

  /* http服务 */
  http.createServer(app.callback())
    .listen(sweetOptions.httpPort);

  /* https服务 */
  if (useHttps && keyFile && certFile) {
    const httpsConfig: object = {
      allowHTTP1: true,
      key: keyFile,
      cert: certFile
    };

    http2.createSecureServer(httpsConfig, app.callback())
      .listen(sweetOptions.httpsPort);
  }
}

export default proServer;