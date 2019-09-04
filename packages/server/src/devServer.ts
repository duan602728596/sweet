/* 开发环境 服务器 */
import './alias';
import * as http from 'http';
import * as http2 from 'http2';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as webpack from 'webpack';
import middleware from './devServer/middleware';
import createRouters from './devServer/createRouters';
import getPort from './devServer/getPort';
import createApi from './utils/createApi';
import createProxy from './utils/createProxy';
import createSweetOptionsMiddleware from './utils/createOptions';
import createHttpsCertificate, { HttpsCertificate } from './utils/createHttpsCertificate';
import { SweetOptions } from './utils/types';

const app: Koa = new Koa();
const router: Router = new Router();

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};

/**
 * compiler { object }: webpack的compiler
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 * serverRender { boolean }: 开启服务器端渲染
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
 */
interface DevServerType {
  compiler?: webpack.Compiler;
  httpPort?: number;
  httpsPort?: number;
  serverRender?: boolean;
  serverRenderFile?: string;
  env?: string;
  renderType?: 'ejs' | 'nunjucks';
  serverChain?: (app: Koa) => void;
  httpsKey?: string;
  httpsCert?: string;
  useBabelRegister?: boolean;
  controllersDir?: string;
  apiFile?: string;
  proxyFile?: string;
}

async function devServer(argv: DevServerType = {}): Promise<void> {
  const {
    compiler,
    httpPort = 5050,
    httpsPort = 5051,
    serverRender,
    serverRenderFile = 'dist-server/server.js',
    env,
    renderType = 'ejs',
    serverChain,
    httpsKey = 'dev.key',
    httpsCert = 'dev.crt',
    useBabelRegister = true,
    controllersDir,
    apiFile,
    proxyFile
  }: DevServerType = argv;

  /* https服务 */
  const [useHttps, keyFile, certFile]: HttpsCertificate = await createHttpsCertificate(sweetOptions, httpsKey, httpsCert);

  /* 合并配置项 */
  Object.assign(sweetOptions, {
    compiler,
    serverRender,
    serverRenderFile,
    env,
    renderType,
    serverChain,
    httpsKey,
    httpsCert,
    useBabelRegister,
    controllersDir,
    apiFile,
    proxyFile,
    httpPort: await getPort(httpPort, true, 'http'),
    httpsPort: await getPort(httpsPort, true, 'https')
  });

  /* 服务器端渲染文件地址 */
  let formatServerRenderFile: string = '';

  if (serverRender) {
    formatServerRenderFile = path.isAbsolute(serverRenderFile)
      ? serverRenderFile
      : path.join(sweetOptions.basicPath, serverRenderFile);
  }

  /* sweetOptions */
  createSweetOptionsMiddleware(app, sweetOptions);

  /* 添加代理服务 */
  await createProxy(sweetOptions, app, true, env);

  /* 扩展koa中间件配置 */
  if (serverChain) {
    await serverChain(app);
  }

  /* 添加其他的中间件*/
  await middleware(app, router, compiler, env, useHttps, keyFile, certFile);

  /* 创建路由 */
  await createRouters(router, sweetOptions, !!serverRender, formatServerRenderFile);

  /* 本地api */
  await createApi(sweetOptions, router, app, true);

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

export default devServer;