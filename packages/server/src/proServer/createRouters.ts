import * as path from 'path';
import { ParsedPath } from 'path';
import * as fs from 'fs';
import * as Router from '@koa/router';
import * as _ from 'lodash';
import preRenderInit from './preProRender';
import { ServerContext, SweetOptions } from '../utils/types';

function createRouters(
  router: Router,
  sweetOptions: SweetOptions,
  serverRender: boolean,
  serverRenderEntry: string,
  serverRoot: string,
  template: string
): void {
  const preRender: Function = preRenderInit(sweetOptions);

  /* index路由 */
  router.get('/*', async (ctx: ServerContext, next: Function): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;

      ctx.routePath = ctxPath;

      await next();

      if (ctx.type === '' && _.isNil(ctx.body)) {
        const isHtml: boolean = /\.html$/i.test(ctxPath);
        const tpPath: string = isHtml ? ctxPath : template;
        const body: Buffer = await fs.promises.readFile(path.join(serverRoot, tpPath));

        ctx.status = 200;
        ctx.type = 'text/html';

        // 路径为*.html
        if (isHtml && sweetOptions.serverRenderRoot) {
          const parseResult: ParsedPath = path.parse(ctxPath);
          const name: string = `${ parseResult.name }.js`;
          const entry: string = path.join(sweetOptions.serverRenderRoot, name);

          ctx.body = (serverRender && fs.existsSync(entry)) ? await preRender(ctxPath, ctx, body, entry) : body;

          return;
        }

        ctx.body = serverRender ? await preRender(ctxPath, ctx, body, serverRenderEntry) : body;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.toString();
    }
  });
}

export default createRouters;