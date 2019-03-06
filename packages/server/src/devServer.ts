/* 开发环境 服务器 */
import * as http from 'http';
import * as http2 from 'http2';
import * as fs from 'fs';
import * as process from 'process';
import * as path from 'path';
import * as Koa from 'koa';
import * as Router from '@eggjs/router';
import * as body from 'koa-body';
import * as mime from 'mime-types';
import * as webpack from 'webpack';
import * as koaWebpack from 'koa-webpack';
import { readFile, defaultRoutersPath, cleanRequireCache, requireModule } from './utils/utils';
import preRender from './utils/preDevRender';
import { SweetOptions, Context } from './utils/types';

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
 */
interface DevServerType {
  compiler?: webpack.Compiler;
  httpPort?: number;
  httpsPort?: number;
  serverRender?: boolean;
  serverRenderFile?: string;
  env?: string;
}

async function devServer(argv: DevServerType = {}): Promise<void> {
  const {
    compiler,
    httpPort = 5050,
    httpsPort = 5051,
    serverRender,
    serverRenderFile = 'buildServer/server.js',
    env
  }: DevServerType = argv;

  /* 将端口加入到服务端 */
  sweetOptions.httpPort = httpPort;
  sweetOptions.httpsPort = httpsPort;

  let formatServerRenderFile: string;

  if (serverRender) {
    formatServerRenderFile = path.isAbsolute(serverRenderFile)
      ? serverRenderFile
      : path.join(sweetOptions.basicPath, serverRenderFile);
  }

  /* post body */
  app.use(body());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  /* webpack中间件 */
  const middlewareConfig: {
    compiler?: webpack.Compiler;
    hotClient: {
      host: {
        client: string;
        server: string;
      };
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
      }
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
  router.get(/^\/[^._\-]*$/, async (ctx: Context, next: Function): Promise<void> => {
    const file: string = ctx.path;
    const mimeType: string | boolean = mime.lookup(file);

    if (file !== '/' && mimeType === false) {
      ctx.path = '/';
      ctx._path = file; // 保存旧的path
    }

    await next();

    // 服务器端渲染
    if (serverRender && ctx.type === 'text/html') {
      ctx.body = await preRender(file, ctx, formatServerRenderFile, sweetOptions);
    }
  });

  /* 本地服务 */
  if (fs.existsSync(defaultRoutersPath(sweetOptions))) {
    const defaultRouter: string = defaultRoutersPath(sweetOptions);

    cleanRequireCache(defaultRouter);

    const routers: Function = requireModule(defaultRouter);

    routers(router, sweetOptions);
  }

  /* http服务 */
  http.createServer(app.callback())
    .listen(httpPort);

  /* https服务 */
  const key: string = path.join(sweetOptions.basicPath, './dev.key');
  const crt: string = path.join(sweetOptions.basicPath, './dev.crt');

  // 判断是否有证书
  if (fs.existsSync(key) && fs.existsSync(crt)) {
    const keyFile: Buffer = await readFile(key);
    const crtFile: Buffer = await readFile(crt);
    const httpsConfig: Object = {
      allowHTTP1: true,
      key: keyFile,
      cert: crtFile
    };

    http2.createSecureServer(httpsConfig, app.callback())
      .listen(httpsPort);
  }
}

export default devServer;