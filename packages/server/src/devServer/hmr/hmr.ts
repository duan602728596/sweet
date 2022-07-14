import type { Server } from 'node:http';
import type { Http2SecureServer } from 'node:http2';
import type { Middleware, Context, Next } from 'koa';
import type { Compiler } from 'webpack';
import type { ClientLogLevel } from './BasicServer';
import SockJSServer from './SockJSServer';
import WSServer from './WSServer';
import createLogger from './createLogger';
import type { SweetOptions } from '../../utils/types';

type Options = {
  compiler: Compiler;
  server: Array<Server | Http2SecureServer>;
  clientLogLevel?: ClientLogLevel;
};

/**
 * 创建koa中间件
 * @param { Options } options
 * @param { SweetOptions } sweetOptions
 */
function koaHmr(options: Options, sweetOptions: SweetOptions): Middleware {
  const log: { [key: string]: Function } = createLogger();
  const sock: SockJSServer | WSServer = new (sweetOptions.socket === 'ws' ? WSServer : SockJSServer)({
    compiler: options.compiler,
    server: options.server,
    log,
    clientLogLevel: options.clientLogLevel ?? 'warn'
  });

  return async function(ctx: Context, next: Next): Promise<void> {
    ctx.state.sock = ctx.sock = sock;

    await next();
  };
}

export default koaHmr;