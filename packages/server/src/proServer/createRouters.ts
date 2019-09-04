import * as path from 'path';
import * as Router from '@koa/router';
import * as _ from 'lodash';
import preRenderInit from './preProRender';
import { readFile } from '../utils/utils';
import { ServerContext, SweetOptions } from '../utils/types';

function createRouters(
  router: Router,
  sweetOptions: SweetOptions,
  serverRender: boolean,
  formatServerRenderFile: string,
  formatServerRoot: string,
  template: string
): void {
  const preRender: Function = preRenderInit(sweetOptions);

  /* html文件允许使用ejs模板 */
  router.get(/^.*\.html$/, async (ctx: ServerContext, next: Function): Promise<void> => {
    const ctxPath: string = ctx.path;
    const body: Buffer = await readFile(path.join(formatServerRoot, ctxPath));

    ctx.routePath = ctxPath; // 保存旧的path
    ctx.status = 200;
    ctx.type = 'text/html';
    ctx.body = serverRender ? await preRender(ctxPath, ctx, body, formatServerRenderFile) : body;
  });

  /* index路由 */
  router.get('/*', async (ctx: ServerContext, next: Function): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;

      await next();

      if (ctx.type === '' && _.isNil(ctx.body)) {
        const body: Buffer = await readFile(path.join(formatServerRoot, template));

        ctx.routePath = ctxPath;
        ctx.status = 200;
        ctx.type = 'text/html';
        ctx.body = serverRender ? await preRender(ctxPath, ctx, body, formatServerRenderFile) : body;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err;
    }
  });
}

export default createRouters;