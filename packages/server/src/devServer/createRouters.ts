import * as path from 'path';
import { ParsedPath } from 'path';
import * as Router from '@koa/router';
import * as mime from 'mime-types';
import preRenderInit from './preDevRender';
import { webpackHmrPath, isExists } from '../utils/utils';
import { ServerContext, SweetOptions } from '../utils/types';

function createRouters(router: Router, sweetOptions: SweetOptions): void {
  const preRender: Function = preRenderInit(sweetOptions);

  /* webpack 重定向 */
  router.get('/*', async (ctx: ServerContext, next: Function): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;
      const mimeType: string | boolean = mime.lookup(ctxPath);

      ctx.routePath = ctxPath; // 保存旧的path

      // 重定向path，所有的路由都指向"/"
      if (ctxPath !== '/' && ctxPath !== webpackHmrPath && mimeType === false) {
        ctx.path = '/';
      }

      await next();

      // 将path改回重定向前的值
      ctx.path = ctxPath;

      // 服务器端渲染
      if (sweetOptions.serverRender && sweetOptions.serverRenderEntry && ctx.type === 'text/html') {
        const isHtml: boolean = /\.html$/i.test(ctxPath);

        // 路径为*.html
        if (isHtml && sweetOptions.serverRenderRoot) {
          const parseResult: ParsedPath = path.parse(ctxPath);
          const name: string = `${ parseResult.name }.js`;
          const entry: string = path.join(sweetOptions.serverRenderRoot, name);

          if (await isExists(entry)) {
            ctx.body = await preRender(ctxPath, ctx, entry);
          }

          return;
        }

        ctx.body = await preRender(ctxPath, ctx, sweetOptions.serverRenderEntry);
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = `<pre style="font-size: 16px">${ err.toString() }</pre>`;
    }
  });
}

export default createRouters;