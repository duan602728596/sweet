import * as process from 'process';
import * as log4js from '@bbkkbkk/koa-log4';
import * as Koa from 'koa';
import createFileConfig from './createFileConfig';
import createHttpConfig from './createHttpConfig';

/**
 * 生成log的中间件
 * @param { 'file' | 'http' } type: 类型
 * @param { { pm2: boolean, url: string, basicPath: string } } options: 配置
 */
interface Options {
  pm2: boolean;
  url: string;
  basicPath: string;
}

interface ServerLog {
  accessLogger: Function;
  logger: object;
}

function serverLog(type: 'file' | 'http', options: Options = { pm2: false, url: '', basicPath: process.cwd() }): ServerLog {
  const config: object = type === 'http' ? createHttpConfig(options.url, options.pm2) : createFileConfig(options.basicPath, options.pm2);

  log4js.configure(config);

  return {
    accessLogger(ctx: Koa.Context, next: Function): Function {
      return log4js.koaLogger(log4js.getLogger('access'));
    },
    logger: log4js.getLogger('application')
  };
}

export default serverLog;