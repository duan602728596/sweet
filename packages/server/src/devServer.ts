/* 开发环境 服务器 */
import * as http from 'http';
import * as http2 from 'http2';
import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import * as Router from '@eggjs/router';
import * as webpack from 'webpack';
import * as register from '@babel/register';
import middleware from './devServer/middleware';
import createRouters from './devServer/createRouters';
import registerConfig from './utils/registerConfig';
import { readFile, defaultApiPath, cleanRequireCache, requireModule } from './utils/utils';
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
    serverChain
  }: DevServerType = argv;

  /* https服务 */
  const key: string = path.join(sweetOptions.basicPath, 'dev.key');
  const crt: string = path.join(sweetOptions.basicPath, 'dev.crt');
  const useHttps: boolean = fs.existsSync(key) && fs.existsSync(crt);
  const keyFile: Buffer | undefined = useHttps ? await readFile(key) : undefined;
  const crtFile: Buffer | undefined = useHttps ? await readFile(crt) : undefined;

  /* 合并配置项 */
  Object.assign(sweetOptions, {
    httpPort,
    httpsPort,
    renderType
  });

  /* 服务器端渲染文件地址 */
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

  await middleware(app, router, compiler, env, useHttps, keyFile, crtFile);

  createRouters(router, sweetOptions, !!serverRender, serverRenderFile);

  /* 本地api */
  if (fs.existsSync(defaultApiPath(sweetOptions.basicPath))) {
    register(registerConfig(sweetOptions));

    const defaultApi: string = defaultApiPath(sweetOptions.basicPath);

    cleanRequireCache(defaultApi);

    const routers: Function = requireModule(defaultApi);

    routers(router, sweetOptions, app);
  }

  /* http服务 */
  http.createServer(app.callback())
    .listen(httpPort);

  /* https服务 */
  if (useHttps && keyFile && crtFile) {
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

export default devServer;