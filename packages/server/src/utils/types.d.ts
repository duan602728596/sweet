import { Context } from 'koa';

export interface SweetOptions {
  basicPath: string;
  httpPort?: number;
  httpsPort?: number;
  renderType?: 'ejs' | 'nunjucks';
}

export interface DevContext extends Context {
  _path?: string; // 保存旧的path
}

export interface Log {
  type: 'file' | 'http';
  pm2: boolean;
  url: string;
}