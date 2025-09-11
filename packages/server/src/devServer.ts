/* 开发环境 服务器 */
import './alias.js';
import * as http from 'node:http';
import type { Server } from 'node:http';
import * as http2 from 'node:http2';
import type { Http2SecureServer, SecureServerOptions } from 'node:http2';
import * as process from 'node:process';
import * as path from 'node:path';
import Koa from 'koa';
import Router from '@koa/router';
import type { Compiler } from 'webpack';
import middleware from './devServer/middleware.js';
import createRouters from './devServer/createRouters.js';
import getPort from './devServer/getPort.js';
import createApi from './utils/createApi.js';
import createProxy from './utils/createProxy.js';
import createRedirectToHttpsMiddleware from './utils/redirectToHttps.js';
import createSweetOptionsMiddleware from './utils/createOptions.js';
import createMock from './utils/createMock.js';
import createHttpsCertificate, { type HttpsCertificate } from './utils/createHttpsCertificate.js';
import koaHmr from './devServer/hmr/hmr.js';
import useRegister from './utils/babelRegister.js';
import { formatPath, runningAtLog, getServerRenderEntry } from './utils/utils.js';
import type { SweetOptions, DevServerArgs } from './utils/types.js';

const app: Koa = new Koa();
const router: Router = new Router();

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/**
 * args参数
 * compiler { object }: webpack的compiler或vite的ViteDevServer
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 * serverRender { boolean }: 开启服务器端渲染
 * serverRenderRoot { string }: 服务器端渲染的文件夹
 * serverRenderFile { string }: 服务器端渲染的主模块文件
 * env { string }: 运行环境，可能的值为test（测试）
 * renderType { string }: html使用的渲染模板
 * serverChain { (app: Koa) => void }: 扩展koa中间件配置
 * httpsKey { string }: https的key的地址
 * httpsCert { string }: https的cert的地址
 * useBabelRegister { boolean }: 是否使用@babel/register，用来优化性能
 * controllersDir { string }: 重新定义的controllers的目录
 * apiFile { string }: 重新定义的api文件
 * proxyFile { string }: 重新定义的proxy文件
 * mockFile { string }: 重新定义的mock文件
 * redirectToHttps { boolean }: 307重定向到https
 * vite { boolean }: 是否为vite模式
 * socket { 'sockjs' | 'ws' }: socket的类型
 */
async function devServer(args: DevServerArgs = {}): Promise<void> {
  const {
    compiler,
    httpPort = 5050,
    httpsPort = 5051,
    serverRender,
    serverRenderRoot = 'dist-server',
    serverRenderFile,
    env,
    renderType = 'ejs',
    serverChain,
    httpsKey = 'dev.key',
    httpsCert = 'dev.crt',
    useBabelRegister = true,
    controllersDir,
    apiFile,
    proxyFile,
    mockFile,
    redirectToHttps = false,
    vite = false,
    socket
  }: DevServerArgs = args;

  /* 合并配置项 */
  const _httpPort: number = await getPort(httpPort, true, 'http');
  const _httpsPort: number = await getPort(httpsPort, true, 'https', _httpPort);

  Object.assign(sweetOptions, {
    compiler,
    serverRender,
    serverRenderRoot: formatPath(sweetOptions, serverRenderRoot),
    serverRenderFile: serverRenderFile ?? (vite ? 'entry-server.mjs' : 'server.js'),
    env,
    renderType,
    serverChain,
    httpsKey,
    httpsCert,
    useBabelRegister,
    controllersDir,
    apiFile,
    proxyFile,
    mockFile,
    redirectToHttps,
    vite,
    socket,
    httpPort: _httpPort,
    httpsPort: _httpsPort
  });

  /* @babel/register */
  await useRegister(sweetOptions);

  /* 添加新的配置项 */
  if (sweetOptions.serverRenderRoot && sweetOptions.serverRenderFile) {
    sweetOptions.serverRenderEntry = await getServerRenderEntry(
      path.join(sweetOptions.serverRenderRoot, sweetOptions.serverRenderFile));
  }

  /* https服务 */
  const [useHttps, keyFile, certFile]: HttpsCertificate = await createHttpsCertificate(sweetOptions, httpsKey, httpsCert);

  /* 显示启动信息 */
  if (env !== 'test') {
    await runningAtLog(sweetOptions, !!(useHttps && keyFile && certFile));
  }

  /* 中间件 */
  createSweetOptionsMiddleware(app, sweetOptions);

  /* https地址307重定向 */
  if (useHttps && keyFile && certFile && redirectToHttps) {
    createRedirectToHttpsMiddleware(app, sweetOptions);
  }

  /* 添加代理服务 */
  await createProxy(sweetOptions, app, true, env);

  /* 扩展koa中间件配置 */
  if (serverChain) {
    await serverChain(app);
  }

  /* 添加其他的中间件*/
  middleware(sweetOptions, app, router, compiler);

  /* 本地mock */
  await createMock(sweetOptions, router, true);

  /* 创建路由 */
  await createRouters(router, sweetOptions);

  /* 本地api */
  await createApi(sweetOptions, router, app, true);

  /* 热替换的server */
  const hmrServer: Array<Server | Http2SecureServer> = [];

  /* http服务 */
  const httpServer: Server = http.createServer(app.callback());
  let http2Server: Http2SecureServer | null = null;

  hmrServer.push(httpServer);

  if (useHttps && keyFile && certFile) {
    const httpsConfig: SecureServerOptions = {
      allowHTTP1: true,
      key: keyFile,
      cert: certFile
    };

    http2Server = http2.createSecureServer(httpsConfig, app.callback());
    hmrServer.push(http2Server);
  }

  if (!vite) {
    app.use(koaHmr({
      compiler: compiler as Compiler,
      server: hmrServer
    }, sweetOptions));
  }

  // 初始化http服务
  httpServer.listen(sweetOptions.httpPort);

  if (http2Server) {
    http2Server.listen(sweetOptions.httpsPort);
  }
}

export default devServer;