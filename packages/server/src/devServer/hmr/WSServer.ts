import type { IncomingMessage } from 'node:http';
import type { Socket } from 'node:net';
import WebSocket, { WebSocketServer } from 'ws';
import BasicServer, { type ServerConnection, type ServerConstructorArgs, type HandleSocketConnection } from './BasicServer.js';

const noop: Function = (): void => { /* noop */ };

/**
 * webpack-dev-middleware的koa实现，使用ws
 * https://github.com/webpack/webpack-dev-server/blob/master/lib/servers/WebsocketServer.js
 */
class WSServer extends BasicServer {
  public wsServer: WebSocketServer; // websocket服务
  public pingTimer: NodeJS.Timeout;

  /**
   * @param { Function } log: 日志方法
   * @param { ClientLogLevel } clientLogLevel: 日志等级
   * @param { Array<Server | Http2SecureServer> } server: http服务
   * @param { Compiler } compiler: webpack compiler
   */
  constructor({ log, clientLogLevel, server, compiler }: ServerConstructorArgs) {
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

    this.pingTimer = setInterval((): void => {
      this.wsServer.clients.forEach((socket: WebSocket): void => {
        if (socket['isAlive'] === false) {
          return socket.terminate();
        }

        socket['isAlive'] = false;
        socket.ping(noop);
      });
    }, 30_000);

    // webpack compiler
    this.compiler = compiler;

    // 当前的sock连接
    this.clients = new Set<ServerConnection>();

    // stats的缓存
    this.stats = null;

    this.setupHooks();
    this.onConnection(this.handleSocketConnection);
    this.wsServer.on('close', this.handleServerClose);
  }

  // 关闭
  handleServerClose: () => void = (): void => {
    clearInterval(this.pingTimer);
    this.clients.clear();
  };

  // 发送数据
  send(client: WebSocket, message: string): void {
    if (client.readyState !== 1) {
      return;
    }

    client.send(message);
  }

  onConnection(f: HandleSocketConnection): void {
    this.wsServer.on('connection', (client: WebSocket, req: IncomingMessage): void => {
      client['isAlive'] = true;
      client.on('pong', (): void => {
        client['isAlive'] = true;
      });

      f(client);
    });
  }
}

export default WSServer;