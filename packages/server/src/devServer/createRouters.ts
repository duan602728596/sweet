import * as path from 'path';
import { ParsedPath } from 'path';
import * as fs from 'fs';
import * as mime from 'mime-types';
import type { Context, Next } from 'koa';
import type * as Router from '@koa/router';
import type { ViteDevServer } from 'vite';
import preRenderInit from './preDevRender';
import { isExists } from '../utils/utils';
import { SweetOptions } from '../utils/types';

function createRouters(router: Router, sweetOptions: SweetOptions): void {
  const preRender: Function = preRenderInit(sweetOptions);

  /* webpack 重定向 */
  router.get(/^\/.*/, async (ctx: Context, next: Next): Promise<void> => {
    try {
      const ctxPath: string = ctx.path;
      const mimeType: string | boolean = mime.lookup(ctxPath);

      ctx.state.routePath = ctxPath; // 保存旧的path

      // 重定向path，所有的路由都指向"/" TODO: webpack-hot-middleware
      if (ctxPath !== '/' && mimeType === false && !sweetOptions.vite) {
        ctx.path = '/';
      }

      await next();

      // 将path改回重定向前的值
      ctx.path = ctxPath;

      if (sweetOptions.vite && !/^\/@/i.test(ctxPath) && /^\s*$/.test(ctx.type)) {
        const isHtml: boolean = /\.html$/i.test(ctxPath);
        const viteRoot: string = (sweetOptions.compiler as ViteDevServer).config.root;
        const htmlFile: string = path.join(viteRoot, ctxPath);

        if (isHtml) {
          if (fs.existsSync(htmlFile)) {
            ctx.type === 'text/html';
            ctx.body = await fs.promises.readFile(htmlFile, { encoding: 'utf8' });
          }
        } else {
          const indexHtmlFile: string = path.join(viteRoot, 'index.html');

          ctx.type === 'text/html';
          ctx.body = await fs.promises.readFile(indexHtmlFile, { encoding: 'utf8' });
        }
      }

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
      ctx.body = `<pre style="font-size: 14px; white-space: pre-wrap;">${ err.stack.toString() }</pre>`;
    }
  });
}

export default createRouters;