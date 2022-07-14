import * as path from 'node:path';
import { ParsedPath } from 'node:path';
import * as fs from 'node:fs';
import mime from 'mime-types';
import { isFileExists } from '@sweet-milktea/utils';
import type { Context, Next } from 'koa';
import type Router from '@koa/router';
// @ts-ignore Node16
import type { ViteDevServer } from 'vite';
import preRenderInit from './preDevRender.js';
import type { SweetOptions } from '../utils/types.js';

async function createRouters(router: Router, sweetOptions: SweetOptions): Promise<void> {
  const preRender: Function = await preRenderInit(sweetOptions);

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

      // 对vite路由的处理
      if (sweetOptions.vite && !/^\/@/i.test(ctxPath) && /^\s*$/.test(ctx.type)) {
        const isHtml: boolean = /\.html$/i.test(ctxPath);
        const compiler: ViteDevServer = sweetOptions.compiler as ViteDevServer;
        const viteRoot: string = compiler.config.root;
        const htmlFilepath: string = path.join(viteRoot, isHtml ? ctxPath : 'index.html');

        if (fs.existsSync(htmlFilepath)) {
          const html: string = await fs.promises.readFile(htmlFilepath, { encoding: 'utf8' });

          ctx.type === 'text/html';
          ctx.body = await compiler.transformIndexHtml(ctxPath, html);
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

          if (await isFileExists(entry)) {
            await preRender(ctxPath, ctx, entry);
          }

          return;
        }

        await preRender(ctxPath, ctx, sweetOptions.serverRenderEntry);
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = `<pre style="font-size: 14px; white-space: pre-wrap;">${ err.stack.toString() }</pre>`;
    }
  });
}

export default createRouters;