import * as path from 'path';
import * as fs from 'fs';
import * as Router from '@koa/router';
import * as _ from 'lodash';
import preRenderInit from './preProRender';
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

  /* index路由 */
  router.get('/*', async (ctx: ServerContext, next: Function): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;

      await next();

      if (ctx.type === '' && _.isNil(ctx.body)) {
        const tpPath: string = /\.html$/i.test(ctxPath) ? ctxPath : template;
        const body: Buffer = await fs.promises.readFile(path.join(formatServerRoot, tpPath));

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