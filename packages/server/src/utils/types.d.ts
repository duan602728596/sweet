import { Context } from 'koa';

export interface SweetOptions {
  basicPath: string;
  httpPort?: number;
  httpsPort?: number;
  renderType?: 'ejs' | 'nunjucks';
  serverRenderFile?: string;
  useBabelRegister?: boolean;
  controllersDir?: string;
  routerFile?: string;
  apiFile?: string;
  proxyFile?: string;
}

export interface ServerContext extends Context {
  _path?: string;     // TODO: 未来移除
  sweetOptions: SweetOptions;
  routePath: string;  // 保存旧的path
}

export interface Log {
  type: 'file' | 'http';
  pm2: boolean;
  url: string;
}