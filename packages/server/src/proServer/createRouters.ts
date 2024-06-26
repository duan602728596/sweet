import * as path from 'node:path';
import type { ParsedPath } from 'node:path';
import * as fs from 'node:fs';
import _ from 'lodash';
import { isFileExists } from '@sweet-milktea/utils';
import type { Context, Next } from 'koa';
import type Router from '@koa/router';
import preRenderInit from './preProRender.js';
import type { SweetOptions } from '../utils/types.js';

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

          if (serverRender && (await isFileExists(entry))) {
            await preRender(ctxPath, ctx, body, entry);
          } else {
            ctx.body = body;
          }

          return;
        }

        if (serverRender) {
          await preRender(ctxPath, ctx, body, serverRenderEntry);
        } else {
          ctx.body = body;
        }
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = `<pre style="font-size: 14px; white-space: pre-wrap;">${ err.stack.toString() }</pre>`;
    }
  });
}

export default createRouters;