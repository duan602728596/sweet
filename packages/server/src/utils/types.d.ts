import * as Koa from 'koa';
import type { Context } from 'koa';
import type { Compiler } from 'webpack';

export interface Log {
  type: 'file' | 'http';
  pm2: boolean;
  url?: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent';

export interface ServerArgs {
  httpPort?: number;
  httpsPort?: number;
  serverRender?: boolean;
  serverRenderRoot?: string;
  serverRenderFile?: string;
  env?: string;
  renderType?: 'ejs' | 'nunjucks';
  serverChain?: (app: Koa) => Promise<void>;
  httpsKey?: string;
  httpsCert?: string;
  useBabelRegister?: boolean;
  controllersDir?: string;
  apiFile?: string;
  proxyFile?: string;
  mockFile?: string;
  redirectToHttps?: boolean;
}

export interface DevServerArgs extends ServerArgs {
  compiler?: Compiler;
}

export interface ProServerArgs extends ServerArgs {
  serverRoot?: string;
  template?: string;
  log?: Log;
}

export interface SweetOptions extends DevServerArgs, ProServerArgs {
  basicPath: string;
  serverRenderEntry?: string;
}

export interface ControllersModule {
  url: string;
  handler(ctx: Context, sweetOptions: SweetOptions): any;
}

// 导出函数类型
export type DevServer = (args: DevServerArgs) => Promise<void>;
export type ProServer = (args: ProServerArgs) => Promise<void>;