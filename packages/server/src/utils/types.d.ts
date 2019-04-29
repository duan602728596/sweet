import * as Koa from 'koa';

export interface SweetOptions {
  basicPath: string;
  httpPort?: number;
  httpsPort?: number;
  renderType?: 'ejs' | 'nunjucks';
}

export interface Context extends Koa.Context {
  _path?: string; // 保存旧的path
}