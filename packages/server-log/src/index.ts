import * as process from 'node:process';
import log4js from '@bbkkbkk/koa-log4';
import type { Context } from 'koa';
import createFileConfig from './createFileConfig.js';
import createHttpConfig from './createHttpConfig.js';

interface Options {
  pm2: boolean;
  url: string;
  basicPath: string;
}

interface ServerLog {
  accessLogger: Function;
  logger: object;
}

/**
 * 生成log的中间件
 * @param { 'file' | 'http' } type - 类型
 * @param { Options } [options = { pm2: false, url: '', basicPath: process.cwd() }] - 配置
 */
function serverLog(type: 'file' | 'http', options: Options = { pm2: false, url: '', basicPath: process.cwd() }): ServerLog {
  const config: object = type === 'http'
    ? createHttpConfig(options.url, options.pm2)
    : createFileConfig(options.basicPath, options.pm2);

  log4js.configure(config);

  return {
    accessLogger(ctx: Context, next: Function): Function {
      return log4js.koaLogger(log4js.getLogger('access'));
    },
    logger: log4js.getLogger('application')
  };
}

export default serverLog;