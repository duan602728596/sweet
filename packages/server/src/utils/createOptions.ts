import * as Koa from 'koa';
import { SweetOptions, ServerContext } from './types';

/* 注入ctx.sweetOptions */
function createSweetOptionsMiddleware(app: Koa, sweetOptions: SweetOptions): void {
  app.use(async function(ctx: ServerContext, next: Function): Promise<void> {
    ctx.sweetOptions = sweetOptions;

    await next();
  });
}

export default createSweetOptionsMiddleware;