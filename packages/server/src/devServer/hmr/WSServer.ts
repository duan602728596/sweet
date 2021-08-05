import type { Server, IncomingMessage } from 'http';
import type { Http2SecureServer } from 'http2';
import type { Socket } from 'net';
import WebSocket, { WebSocketServer } from 'ws';
import type { Compiler } from 'webpack';
import BasicServer, { ServerItem, ClientLogLevel } from './BasicServer';

const noop: Function = (): void => { /* noop */ };

/**
 * webpack-dev-middleware的koa实现，使用ws
 * https://github.com/webpack/webpack-dev-server/blob/master/lib/servers/WebsocketServer.js
 */
class WSServer extends BasicServer {
  public wsServer: WebSocketServer; // websocket服务

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

    this.wsServer = new WebSocketServer({
      noServer: true,
      path: '/ws'
    });

    // 创建服务
    for (const serve of server) {
      serve.on('upgrade', (req: IncomingMessage, sock: Socket, head: Buffer): void => {
        if (!this.wsServer.shouldHandle(req)) {
          return;
        }

        this.wsServer.handleUpgrade(req, sock, head, (connection: WebSocket): void => {
          this.wsServer.emit('connection', connection, req);
        });
      });
    }

    this.wsServer.on('error', (err: Error): void => {
      this.log.error(err.message);
    });

    setInterval((): void => {
      this.wsServer.clients.forEach((socket: WebSocket): void => {
        if (socket.isAlive === false) {
          return socket.terminate();
        }

        socket.isAlive = false;
        socket.ping(noop);
      });
    }, 30_000);

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
  send(connection: WebSocket, message: string): void {
    if (connection.readyState !== 1) {
      return;
    }

    connection.send(message);
  }

  // f should be passed the resulting connection and the connection headers
  onConnection(f: Function): void {
    this.wsServer.on('connection', (connection: WebSocket, req: IncomingMessage): void => {
      connection['isAlive'] = true;
      connection.on('pong', (): void => {
        connection['isAlive'] = true;
      });

      f(connection, req.headers);
    });
  }
}

export default WSServer;