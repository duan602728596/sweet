import * as https from 'https';
import { Server } from 'https';
import * as webpack from 'webpack';
import { Stats } from 'webpack';
import * as koaWebpack from 'koa-webpack';
import * as _ from 'lodash';
import getPort from './getPort';
import { WebpackLog } from '../utils/types';

interface MiddlewareConfig {
  compiler?: webpack.Compiler;
  hotClient: {
    host: {
      client: string;
      server: string;
    };
    allEntries: boolean;
    https: boolean;
    server?: Server;
    logLevel?: string;
  };
  devMiddleware: {
    serverSideRender: boolean;
    logLevel?: string;
    stats?: Stats.ToStringOptions;
  };
}

/**
 * middleware配置
 * @param { webpack.Compiler | undefined } compiler
 * @param { string } webpackLog: webpack日志
 * @param { string | undefined } env: 环境
 * @param { boolean } useHttps: 是否使用https
 * @param { Server | undefined } server: 服务
 */
export function createMiddlewareConfig(
  compiler: webpack.Compiler | undefined,
  webpackLog: WebpackLog | undefined,
  env: string | undefined,
  useHttps: boolean,
  server: Server | undefined
): MiddlewareConfig {
  const middlewareConfig: MiddlewareConfig = {
    compiler,
    hotClient: {
      host: {
        client: '*',
        server: '0.0.0.0'
      },
      allEntries: true,
      https: useHttps,
      server
    },
    devMiddleware: {
      serverSideRender: true
    }
  };

  // webpack log
  if (!webpackLog || webpackLog === 'progress') {
    middlewareConfig.hotClient.logLevel = 'warn';
    middlewareConfig.devMiddleware.logLevel = 'warn';
    middlewareConfig.devMiddleware.stats = {
      colors: true,
      assets: false,
      entrypoints: false,
      builtAt: false,
      hash: false,
      modules: false,
      version: false,
      timings: false
    };
  }

  // 测试配置
  if (env === 'test') {
    middlewareConfig.hotClient.logLevel = 'silent';
    middlewareConfig.devMiddleware.logLevel = 'silent';
  }

  return middlewareConfig;
}

/**
 * koa-webpack中间件配置
 * @param { webpack.Compiler | undefined } compiler
 * @param { string } webpackLog: webpack日志
 * @param { string } env: 环境
 * @param { boolean } useHttps: 是否使用https
 * @param { string | undefined } keyFile: key
 * @param { string | undefined } crtFile: cert
 */
async function createKoaWebpack(
  compiler: webpack.Compiler | undefined,
  webpackLog: WebpackLog | undefined,
  env: string | undefined,
  useHttps: boolean,
  keyFile: Buffer | undefined,
  crtFile: Buffer | undefined
): Promise<koaWebpack.Middleware<any>> {
  let server: Server | undefined = undefined;

  if (useHttps && keyFile && crtFile) {
    const socketPort: number = await getPort(_.random(15000, 50000));

    server = https.createServer({
      key: keyFile,
      cert: crtFile
    }).listen(socketPort, '127.0.0.1');
  }

  const middlewareConfig: MiddlewareConfig = createMiddlewareConfig(compiler, webpackLog, env, useHttps, server);
  const middleware: koaWebpack.Middleware<any> = await koaWebpack(middlewareConfig);

  return middleware;
}

export default createKoaWebpack;