import * as path from 'path';
import { Context } from 'koa';
import * as Router from '@koa/router';
import preRenderInit from './preProRender';
import { readFile } from '../utils/utils';
import { SweetOptions } from '../utils/types';

function createRouters(
  router: Router,
  sweetOptions: SweetOptions,
  serverRender: boolean,
  formatServerRenderFile: string,
  formatServerRoot: string,
  template: string
): void {
  const preRender: Function = preRenderInit(sweetOptions);

  /* index路由 */
  router.get(/^\/[^._\-]*$/, async (ctx: Context, next: Function): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;
      const body: Buffer = await readFile(path.join(formatServerRoot, template));

      ctx.status = 200;
      ctx.type = 'text/html';
      ctx.body = serverRender ? await preRender(ctxPath, ctx, body, formatServerRenderFile) : body;

      await next();
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;

      console.error(err);
    }
  });

  /* html文件允许使用ejs模板 */
  router.get(/^.*\.html$/, async (ctx: Context, next: Function): Promise<void> => {
    const ctxPath: string = ctx.path;
    const body: Buffer = await readFile(path.join(formatServerRoot, ctxPath));

    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.body = serverRender ? await preRender(ctxPath, ctx, body, formatServerRenderFile) : body;

    await next();
  });
}

export default createRouters;