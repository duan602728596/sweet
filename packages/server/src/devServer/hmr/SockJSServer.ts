import type { IncomingMessage, Server } from 'http';
import type { Http2SecureServer } from 'http2';
import * as sockjs from 'sockjs';
import { Session as SockjsSession } from 'sockjs/lib/transport';
import type { Compiler, Stats, compilation } from 'webpack';

type ServerItem = Server | Http2SecureServer;

// Workaround for sockjs@~0.3.19
// sockjs will remove Origin header, however Origin header is required for checking host.
// See https://github.com/webpack/webpack-dev-server/issues/1604 for more information
const decorateConnection: Function = SockjsSession.prototype.decorateConnection;

SockjsSession.prototype.decorateConnection = function(req: IncomingMessage): void {
  decorateConnection.call(this, req);
  const connection: any = this.connection;

  if (connection.headers && !('origin' in connection.headers) && 'origin' in req.headers) {
    connection.headers.origin = req.headers.origin;
  }
};

class SockJSServer {
  // webpack stats配置
  static DEFAULT_STATS: Stats.ToJsonOptions = {
    all: false,
    hash: true,
    assets: true,
    warnings: true,
    errors: true,
    errorDetails: false
  };

  static NAME: string = 'koa-hmr'; // name

  public log: { [key: string]: Function };
  public sock: any;
  public compiler: Compiler;
  public sockets: Array<any>;
  public _stats: any;

  /**
   * @param { Function } log: 日志方法
   * @param { Array<Server | Http2SecureServer> } server: http服务
   * @param { Compiler } compiler: webpack compiler
   */
  constructor({ log, server, compiler }: {
    log: { [key: string]: Function };
    server: Array<ServerItem>;
    compiler: Compiler;
  }) {
    // 日志
    this.log = log;

    // sock服务
    this.sock = sockjs.createServer({
      sockjs_url: '/__webpack_dev_server__/sockjs.bundle.js',
      log: (severity: string, line: any): void => {
        if (severity === 'error') {
          this.log.error(line);
        } else {
          this.log.debug(line);
        }
      }
    });

    // 挂载服务
    for (const serve of server) {
      this.sock.installHandlers(serve, {
        prefix: '/sockjs-node'
      });
    }

    // webpack compiler
    this.compiler = compiler;

    // 当前的sock连接
    this.sockets = [];

    // stats的缓存
    this._stats = null;

    this.setupHooks();
  }

  // 获取stats
  getStats(statsObj: Stats): Stats.ToJsonOutput {
    const stats: Stats.ToJsonOptions = SockJSServer.DEFAULT_STATS;

    return statsObj.toJson(stats);
  }

  // webpack hooks
  setupHooks(): void {
    // Listening for events
    const invalidPlugin: (arg1: {}, arg2: any, arg3: any, ...args: any[]) => any = (): void => {
      this.sockWrite('invalid');
    };

    const addHooks: Function = (compiler: Compiler): void => {
      const { compile, invalid, done }: compilation.CompilerHooks = compiler.hooks;

      compile.tap(SockJSServer.NAME, invalidPlugin);
      invalid.tap(SockJSServer.NAME, invalidPlugin);
      done.tap(SockJSServer.NAME, (stats: Stats) => {
        this._sendStats(this.getStats(stats));
        this._stats = stats;
      });
    };

    // @ts-ignore
    if (this.compiler.compilers) {
      // @ts-ignore
      this.compiler.compilers.forEach(addHooks);
    } else {
      addHooks(this.compiler);
    }
  }

  // 发送数据
  send(connection: any, message: string): void {
    // prevent cases where the server is trying to send data while connection is closing
    if (connection.readyState !== 1) {
      return;
    }

    connection.write(message);
  }

  // 关闭连接
  close(connection: any): void {
    connection.close();
  }

  // f should be passed the resulting connection and the connection headers
  onConnection(f: Function): void {
    this.sock.on('connection', (connection: any): void => {
      f(connection, connection ? connection.headers : null);
    });
  }

  onConnectionClose(connection: any, f: Function): void {
    connection.on('close', f);
  }

  sockWriteConnection(connection: any, type: string, data?: any): void {
    this.send(connection, JSON.stringify({ type, data }));
  }

  sockWrite(type: string, data?: any): void {
    this.sockets.forEach((socket: any): void => {
      this.send(socket, JSON.stringify({ type, data }));
    });
  }

  _sendStatsConnection(connection: any, stats: any, force?: any): void {
    const shouldEmit: boolean = !force
      && stats
      && (!stats.errors || stats.errors.length === 0)
      && stats.assets
      && stats.assets.every((asset: any): boolean => !asset.emitted);

    if (shouldEmit) {
      return this.sockWriteConnection(connection, 'still-ok');
    }

    this.sockWriteConnection(connection, 'hash', stats.hash);

    if (stats.errors.length > 0) {
      this.sockWriteConnection(connection, 'errors', stats.errors);
    } else if (stats.warnings.length > 0) {
      this.sockWriteConnection(connection, 'warnings', stats.warnings);
    } else {
      this.sockWriteConnection(connection, 'ok');
    }
  }

  // send stats to a socket or multiple sockets
  _sendStats(stats: any, force?: any): void {
    const shouldEmit: boolean = !force
      && stats
      && (!stats.errors || stats.errors.length === 0)
      && stats.assets
      && stats.assets.every((asset: any): boolean => !asset.emitted);

    if (shouldEmit) {
      return this.sockWrite('still-ok');
    }

    this.sockWrite('hash', stats.hash);

    if (stats.errors.length > 0) {
      this.sockWrite('errors', stats.errors);
    } else if (stats.warnings.length > 0) {
      this.sockWrite('warnings', stats.warnings);
    } else {
      this.sockWrite('ok');
    }
  }
}

export default SockJSServer;