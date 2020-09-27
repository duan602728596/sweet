import type { Server } from 'http';
import type { Http2SecureServer } from 'http2';
import type { Middleware, Context } from 'koa';
import type { Compiler } from 'webpack';
import SockJSServer from './SockJSServer';
import createLogger from './createLogger';

type Options = {
  compiler: Compiler;
  server: Array<Server | Http2SecureServer>;
};

/**
 * 创建koa中间件
 * @param { Options } options
 */
function koaHmr(options: Options): Middleware {
  const log: { [key: string]: Function } = createLogger();
  const sock: SockJSServer = new SockJSServer({
    compiler: options.compiler,
    server: options.server,
    log
  });

  sock.onConnection((connection: Function, headers: { [key: string]: string }): void => {
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

    sock.onConnectionClose(connection, () => {
      const idx: number = sock.sockets.indexOf(connection);

      if (idx >= 0) {
        sock.sockets.splice(idx, 1);
      }
    });

    sock.sockWriteConnection(connection, 'logging', 'info');
    sock.sockWriteConnection(connection, 'hot');
    sock.sockWriteConnection(connection, 'liveReload'); // TODO: change condition at major version

    if (!sock.stats) {
      return;
    }

    sock.sendStatsConnection(connection, sock.getStats(sock.stats), true);
  });

  return async function(ctx: Context, next: Function): Promise<void> {
    ctx.state.sock = sock;
    ctx.sock = sock;

    await next();
  };
}

export default koaHmr;