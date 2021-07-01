/* 生产环境 服务器 */
import './alias';
import * as http from 'http';
import * as http2 from 'http2';
import type { SecureServerOptions } from 'http2';
import * as process from 'process';
import * as path from 'path';
import Koa from 'koa';
import Router from '@koa/router';
import middleware from './proServer/middleware';
import createRouters from './proServer/createRouters';
import portUse from './proServer/portUse';
import createApi from './utils/createApi';
import createProxy from './utils/createProxy';
import createMock from './utils/createMock';
import createRedirectToHttpsMiddleware from './utils/redirectToHttps';
import createSweetOptionsMiddleware from './utils/createOptions';
import createHttpsCertificate, { HttpsCertificate } from './utils/createHttpsCertificate';
import useRegister from './utils/babelRegister';
import { formatPath, runningAtLog } from './utils/utils';
import type { SweetOptions, ProServerArgs } from './utils/types';

const app: Koa = new Koa();
const router: Router = new Router();

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/**
 * args参数
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 * serverRoot { string }: 生产环境下的服务器静态文件入口
 * serverRender { boolean }: 开启服务器端渲染
 * serverRenderRoot { string }: 服务器端渲染的文件夹
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
 * mockFile { string }: 重新定义的mock文件
 * redirectToHttps { boolean }: 307重定向到https
 * vite { boolean }: 是否为vite模式
 */
async function proServer(args: ProServerArgs = {}): Promise<void> {
  const {
    httpPort = 80,
    httpsPort = 443,
    serverRoot = 'dist',
    serverRender,
    serverRenderRoot = 'dist-server',
    serverRenderFile = 'server.js',
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
    proxyFile,
    mockFile,
    redirectToHttps = false,
    vite = false
  }: ProServerArgs = args;

  /* 合并配置项 */
  Object.assign(sweetOptions, {
    serverRoot: formatPath(sweetOptions, serverRoot),
    serverRender,
    serverRenderRoot: formatPath(sweetOptions, serverRenderRoot),
    serverRenderFile: serverRenderFile ?? (vite ? 'entry-server.js' : 'server.js'),
    env,
    template,
    renderType,
    log,
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
    httpPort: await portUse(httpPort, 'http'),
    httpsPort: await portUse(httpsPort, 'https')
  });

  /* 添加新的配置项 */
  if (sweetOptions.serverRenderRoot && sweetOptions.serverRenderFile) {
    sweetOptions.serverRenderEntry = path.join(sweetOptions.serverRenderRoot, sweetOptions.serverRenderFile);
  }

  /* @babel/register */
  await useRegister(sweetOptions);

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
  await createProxy(sweetOptions, app, false, env);

  /* 扩展koa中间件配置 */
  if (serverChain) {
    await serverChain(app);
  }

  /* 添加其他的中间件 */
  await middleware(app, router, sweetOptions);

  /* 本地mock */
  await createMock(sweetOptions, router, true);

  /* 创建路由 */
  await createRouters(
    router,
    sweetOptions,
    !!sweetOptions.serverRender,
    sweetOptions.serverRenderEntry ?? '',
    sweetOptions.serverRoot ?? '',
    template
  );

  /* 本地api */
  await createApi(sweetOptions, router, app, false);

  /* http服务 */
  http.createServer(app.callback())
    .listen(sweetOptions.httpPort);

  /* https服务 */
  if (useHttps && keyFile && certFile) {
    const httpsConfig: SecureServerOptions = {
      allowHTTP1: true,
      key: keyFile,
      cert: certFile
    };

    http2.createSecureServer(httpsConfig, app.callback())
      .listen(sweetOptions.httpsPort);
  }
}

export default proServer;