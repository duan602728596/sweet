/* 开发环境 服务器 */
import * as http from 'http';
import * as https from 'https';
import { Server } from 'https';
import * as http2 from 'http2';
import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import * as Router from '@eggjs/router';
import * as body from 'koa-body';
import * as compress from '@bbkkbkk/koa-compress';
import * as mime from 'mime-types';
import * as webpack from 'webpack';
import * as koaWebpack from 'koa-webpack';
import * as _ from 'lodash';
import * as register from '@babel/register';
import registerConfig from './utils/registerConfig';
import { readFile, defaultApiPath, cleanRequireCache, requireModule } from './utils/utils';
import preRenderInit from './utils/preDevRender';
import { SweetOptions, DevContext } from './utils/types';

const app: Koa = new Koa();
const router: Router = new Router();

/* 基础配置 */
const sweetOptions: SweetOptions = {
  basicPath: process.cwd() // 主目录
};
const preRender: Function = preRenderInit(sweetOptions);

/**
 * compiler { object }: webpack的compiler
 * httpPort { number }: http端口号
 * httpsPort { number }: https端口号
 * serverRender { boolean }: 开启服务器端渲染
 * serverRenderFile { string }: 服务器端渲染的主模块文件
 * env { string }: 运行环境，可能的值为test（测试）
 * renderType { string }: html使用的渲染模板
 */
interface DevServerType {
  compiler?: webpack.Compiler;
  httpPort?: number;
  httpsPort?: number;
  serverRender?: boolean;
  serverRenderFile?: string;
  env?: string;
  renderType?: 'ejs' | 'nunjucks';
}

async function devServer(argv: DevServerType = {}): Promise<void> {
  const {
    compiler,
    httpPort = 5050,
    httpsPort = 5051,
    serverRender,
    serverRenderFile = 'dist-server/server.js',
    env,
    renderType = 'ejs'
  }: DevServerType = argv;

  /* https服务 */
  const key: string = path.join(sweetOptions.basicPath, './dev.key');
  const crt: string = path.join(sweetOptions.basicPath, './dev.crt');
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
  let formatServerRenderFile: string;

  if (serverRender) {
    formatServerRenderFile = path.isAbsolute(serverRenderFile)
      ? serverRenderFile
      : path.join(sweetOptions.basicPath, serverRenderFile);
  }

  /* 文件压缩 */
  app.use(compress({
    useBrCompress: false // 关闭brotli压缩
  }));

  /* post body */
  app.use(body());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack中间件 */
  let server: Server | undefined = undefined;

  if (useHttps && keyFile && crtFile) {
    server = https.createServer({
      key: keyFile,
      cert: crtFile
    }).listen(_.random(15000, 50000), '127.0.0.1');
  }

  const middlewareConfig: {
    compiler?: webpack.Compiler;
    hotClient: {
      host: {
        client: string;
        server: string;
      };
      https: boolean;
      server?: Server;
      logLevel?: string;
    };
    devMiddleware: {
      serverSideRender: boolean;
      logLevel?: string;
    };
  } = {
    compiler,
    hotClient: {
      host: {
        client: '*',
        server: '0.0.0.0'
      },
      https: useHttps,
      server
    },
    devMiddleware: {
      serverSideRender: true
    }
  };

  // 测试配置
  if (env === 'test') {
    middlewareConfig.hotClient.logLevel = 'silent';
    middlewareConfig.devMiddleware.logLevel = 'silent';
  }

  const middleware: koaWebpack.Middleware<any> = await koaWebpack(middlewareConfig);

  app.use(middleware);

  /* webpack 重定向 */
  router.get(/^\/[^._\-]*$/, async (ctx: DevContext, next: Function): Promise<void> => {
    const ctxPath: string = ctx.path;
    const mimeType: string | boolean = mime.lookup(ctxPath);

    // 重定向path，所有的路由都指向"/"
    if (ctxPath !== '/' && mimeType === false) {
      ctx.path = '/';
      ctx._path = ctxPath; // TODO: 保存旧的path（可能用不上）
    }

    await next();

    // 将path改回重定向前的值
    ctx.path = ctxPath;

    // 服务器端渲染
    if (serverRender && ctx.type === 'text/html') {
      ctx.body = await preRender(ctxPath, ctx, formatServerRenderFile);
    }
  });

  /* html文件允许使用ejs模板 */
  router.get(/^.*\.html$/, async (ctx: DevContext, next: Function): Promise<void> => {
    const ctxPath: string = ctx.path;

    await next();

    // 服务器端渲染
    if (serverRender) {
      ctx.body = await preRender(ctxPath, ctx, formatServerRenderFile);
    }
  });

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