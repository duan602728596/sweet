import type { Server } from 'http';
import type { Http2SecureServer } from 'http2';
import type { Compiler, Stats, StatsCompilation } from 'webpack';
import type ws from 'ws';
import type { Connection as SockjsConnection } from 'sockjs';

export type ServerItem = Server | Http2SecureServer;
export type ServerConnection = ws | SockjsConnection;
export type ClientLogLevel = 'silent' | 'trace' | 'debug' | 'info' | 'warn' | 'error';

/* 为sockjs服务和ws定义通用的方法 */
class BasicServer {
  static DEFAULT_STATS: any = {
    all: false,
    hash: true,
    assets: true,
    warnings: true,
    errors: true,
    errorDetails: false
  };
  static NAME: string = 'koa-hmr'; // name

  public log: { [key: string]: Function }; // 日志
  public clientLogLevel: ClientLogLevel;   // 日志等级
  public compiler: Compiler;               // webpack compiler
  public sockets: Array<ServerConnection>; // 当前的socket链接
  public stats: any;                       // webpack stats

  // 获取stats
  getStats(statsObj: Stats): StatsCompilation {
    const stats: any = BasicServer.DEFAULT_STATS;

    return statsObj.toJson(stats);
  }

  // webpack hooks
  setupHooks(): void {
    // Listening for events
    const invalidPlugin: () => void = (): void => {
      this.sockWrite('invalid');
    };

    const addHooks: Function = (compiler: Compiler): void => {
      const { compile, invalid, done }: any = compiler.hooks;

      compile.tap(BasicServer.NAME, invalidPlugin);
      invalid.tap(BasicServer.NAME, invalidPlugin);
      done.tap(BasicServer.NAME, (stats: Stats) => {
        this.sendStats(this.getStats(stats));
        this.stats = stats;
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

  // 关闭连接
  close(connection: ServerConnection): void {
    connection.close();
  }

  /* 定义连接事件 */
  // connection close
  onConnectionClose(connection: ServerConnection, f: () => void): void {
    connection.on('close', f);
  }

  sockWriteConnection(connection: ServerConnection, type: string, data?: any): void {
    this.send(connection, JSON.stringify({ type, data }));
  }

  sockWrite(type: string, data?: any): void {
    this.sockets.forEach((socket: ServerConnection): void => {
      this.send(socket, JSON.stringify({ type, data }));
    });
  }

  // send stats to a socket or multiple sockets
  sendStats(stats: StatsCompilation, force?: any): void {
    const shouldEmit: boolean | undefined = !force
      && stats
      && (!stats.errors || stats.errors.length === 0)
      && stats.assets
      && stats.assets.every((asset: any): boolean => !asset.emitted);

    if (shouldEmit) {
      return this.sockWrite('still-ok');
    }

    this.sockWrite('hash', stats.hash);

    if (stats?.errors?.length) {
      this.sockWrite('errors', stats.errors);
    } else if (stats?.warnings?.length) {
      this.sockWrite('warnings', stats.warnings);
    } else {
      this.sockWrite('ok');
    }
  }

  sendStatsConnection(connection: ServerConnection, stats: StatsCompilation, force?: any): void {
    const shouldEmit: boolean | undefined = !force
      && stats
      && (!stats.errors || stats.errors.length === 0)
      && stats.assets
      && stats.assets.every((asset: any): boolean => !asset.emitted);

    if (shouldEmit) {
      return this.sockWriteConnection(connection, 'still-ok');
    }

    this.sockWriteConnection(connection, 'hash', stats.hash);

    if (stats?.errors?.length) {
      this.sockWriteConnection(connection, 'errors', stats.errors);
    } else if (stats?.warnings?.length) {
      this.sockWriteConnection(connection, 'warnings', stats.warnings);
    } else {
      this.sockWriteConnection(connection, 'ok');
    }
  }

  send(...args: any[]): void { /* loop */ }

  // 连接
  handleSocketConnection: Function = (connection: ServerConnection, headers: { [key: string]: string }): void => {
    if (!connection) {
      return;
    }

    if (!headers) {
      this.log.warn(
        'transportMode.server implementation must pass headers to the callback of onConnection(f) '
        + 'via f(connection, headers) in order for clients to pass a headers security check'
      );
    }

    this.sockets.push(connection);

    this.onConnectionClose(connection, (): void => {
      const idx: number = this.sockets.indexOf(connection);

      if (idx >= 0) {
        this.sockets.splice(idx, 1);
      }
    });

    this.sockWriteConnection(connection, 'logging', this.clientLogLevel);
    this.sockWriteConnection(connection, 'hot');
    this.sockWriteConnection(connection, 'liveReload');
    this.sockWriteConnection(connection, 'overlay', true);

    if (this.stats) {
      this.sendStatsConnection(connection, this.getStats(this.stats), true);
    }
  };
}

export default BasicServer;