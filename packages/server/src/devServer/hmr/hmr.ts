import type { Server } from 'http';
import type { Http2SecureServer } from 'http2';
import type { Middleware, Context, Next } from 'koa';
import type { Compiler } from 'webpack';
import type { ServerConnection } from './BasicServer';
import SockJSServer from './SockJSServer';
import WebSocketServer from './WebSocketServer';
import createLogger from './createLogger';
import type { SweetOptions } from '../../utils/types';

type Options = {
  compiler: Compiler;
  server: Array<Server | Http2SecureServer>;
  clientLogLevel?: 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error';
};

/**
 * 创建koa中间件
 * @param { Options } options
 * @param { SweetOptions } sweetOptions
 */
function koaHmr(options: Options, sweetOptions: SweetOptions): Middleware {
  const log: { [key: string]: Function } = createLogger();
  const sock: SockJSServer | WebSocketServer
    = new (sweetOptions.socket === 'ws' ? WebSocketServer : SockJSServer)({
      compiler: options.compiler,
      server: options.server,
      log
    });

  sock.onConnection((connection: ServerConnection, headers: { [key: string]: string }): void => {
    if (!connection) {
      return;
    }

    if (!headers) {
      log.warn(
        'transportMode.server implementation must pass headers to the callback of onConnection(f) '
        + 'via f(connection, headers) in order for clients to pass a headers security check'
      );
    }

    sock.sockets.push(connection);

    sock.onConnectionClose(connection, (): void => {
      const idx: number = sock.sockets.indexOf(connection);

      if (idx >= 0) {
        sock.sockets.splice(idx, 1);
      }
    });

    sock.sockWriteConnection(connection, 'logging', options.clientLogLevel ?? 'warn');
    sock.sockWriteConnection(connection, 'hot');
    sock.sockWriteConnection(connection, 'liveReload');
    sock.sockWriteConnection(connection, 'overlay', true);

    if (sock.stats) {
      sock.sendStatsConnection(connection, sock.getStats(sock.stats), true);
    }
  });

  return async function(ctx: Context, next: Next): Promise<void> {
    ctx.state.sock = ctx.sock = sock;

    await next();
  };
}

export default koaHmr;