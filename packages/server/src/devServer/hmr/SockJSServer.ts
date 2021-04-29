import type { IncomingMessage, Server } from 'http';
import type { Http2SecureServer } from 'http2';
import sockjs from 'sockjs';
import type { Server as SockjsServer, Connection as SockjsConnection } from 'sockjs';
import { Session as SockjsSession } from 'sockjs/lib/transport';
import type { Compiler } from 'webpack';
import BasicServer, { ServerItem, ClientLogLevel } from './BasicServer';

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

/**
 * webpack-dev-middleware的koa实现，使用sockjs
 * https://github.com/webpack/webpack-dev-server/blob/master/lib/servers/SockJSServer.js
 */
class SockJSServer extends BasicServer {
  public sockjsServer: SockjsServer; // sockjs服务

  /**
   * @param { Function } log: 日志方法
   * @param { ClientLogLevel } clientLogLevel: 日志等级
   * @param { Array<Server | Http2SecureServer> } server: http服务
   * @param { Compiler } compiler: webpack compiler
   */
  constructor({ log, clientLogLevel, server, compiler }: {
    log: { [key: string]: Function };
    clientLogLevel: ClientLogLevel;
    server: Array<ServerItem>;
    compiler: Compiler;
  }) {
    super();

    // 日志
    this.log = log;
    this.clientLogLevel = clientLogLevel;

    // sock服务
    this.sockjsServer = sockjs.createServer({
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
      this.sockjsServer.installHandlers(serve as Server, {
        prefix: '/ws'
      });
    }

    // webpack compiler
    this.compiler = compiler;

    // 当前的sock连接
    this.sockets = [];

    // stats的缓存
    this.stats = null;

    this.setupHooks();
    this.onConnection(this.handleSocketConnection);
  }

  // 发送数据
  send(connection: SockjsConnection, message: string): void {
    // prevent cases where the server is trying to send data while connection is closing
    if (connection.readyState !== 1) {
      return;
    }

    connection.write(message);
  }

  // f should be passed the resulting connection and the connection headers
  onConnection(f: Function): void {
    this.sockjsServer.on('connection', (connection: SockjsConnection): void => {
      f(connection, connection ? connection.headers : null);
    });
  }
}

export default SockJSServer;