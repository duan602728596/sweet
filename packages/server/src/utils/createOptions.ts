import * as Koa from 'koa';
import type { Context } from 'koa';
import type { SweetOptions } from './types';

/* 注入ctx.state.sweetOptions */
function createSweetOptionsMiddleware(app: Koa, sweetOptions: SweetOptions): void {
  app.use(async function(ctx: Context, next: Function): Promise<void> {
    ctx.state.sweetOptions = sweetOptions;
    ctx.sweetOptions = sweetOptions; // TODO: remove

    await next();
  });
}

export default createSweetOptionsMiddleware;