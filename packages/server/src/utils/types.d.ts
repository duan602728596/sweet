import * as Koa from 'koa';
import { Context } from 'koa';
import { Compiler } from 'webpack';

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

export interface ServerContext extends Context {
  sweetOptions: SweetOptions;
  routePath: string;  // 保存旧的path
}

export interface Log {
  type: 'file' | 'http';
  pm2: boolean;
  url: string;
}