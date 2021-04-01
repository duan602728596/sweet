import type { Server } from 'http';
import type { Http2SecureServer } from 'http2';
import type { Compiler, Stats } from 'webpack';

export type ServerItem = Server | Http2SecureServer;

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
  public compiler: Compiler;               // webpack compiler
  public sockets: Array<any>;              // 当前的socket链接
  public stats: any;                       // webpack stats

  // 获取stats
  getStats(statsObj: Stats): any {
    const stats: any = BasicServer.DEFAULT_STATS;

    return statsObj.toJson(stats);
  }

  // webpack hooks
  setupHooks(): void {
    // Listening for events
    const invalidPlugin: () => any = (): void => {
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
  close(connection: any): void {
    connection.close();
  }

  /* 定义连接事件 */
  // connection close
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

  // send stats to a socket or multiple sockets
  sendStats(stats: any, force?: any): void {
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

  sendStatsConnection(connection: any, stats: any, force?: any): void {
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

  send(...args: any[]): void { /* loop */ }
}

export default BasicServer;