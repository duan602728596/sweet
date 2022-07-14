import type Koa from 'koa';
import type { Context } from 'koa';
import type { SweetOptions } from './types.js';

/* 注入ctx.state.sweetOptions */
function createSweetOptionsMiddleware(app: Koa, sweetOptions: SweetOptions): void {
  app.use(async function(ctx: Context, next: Function): Promise<void> {
    ctx.state.sweetOptions = ctx.sweetOptions = sweetOptions;

    await next();
  });
}

export default createSweetOptionsMiddleware;