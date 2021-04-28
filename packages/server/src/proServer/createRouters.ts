import * as path from 'path';
import type { ParsedPath } from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import type { Context, Next } from 'koa';
import type * as Router from '@koa/router';
import preRenderInit from './preProRender';
import { isExists } from '../utils/utils';
import type { SweetOptions } from '../utils/types';

async function createRouters(
  router: Router,
  sweetOptions: SweetOptions,
  serverRender: boolean,
  serverRenderEntry: string,
  serverRoot: string,
  template: string
): Promise<void> {
  const preRender: Function = await preRenderInit(sweetOptions);

  /* index路由 */
  router.get(/^\/.*/, async (ctx: Context, next: Next): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;

      ctx.state.routePath = ctxPath; // 保存旧的path

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

          ctx.body = (serverRender && (await isExists(entry))) ? await preRender(ctxPath, ctx, body, entry) : body;

          return;
        }

        ctx.body = serverRender ? await preRender(ctxPath, ctx, body, serverRenderEntry) : body;
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = `<pre style="font-size: 14px; white-space: pre-wrap;">${ err.stack.toString() }</pre>`;
    }
  });
}

export default createRouters;