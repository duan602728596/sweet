import * as path from 'node:path';
import { ParsedPath } from 'node:path';
import * as fs from 'node:fs';
import mime from 'mime-types';
import { isFileExists } from '@sweet-milktea/utils';
import type { Context, Next } from 'koa';
import type Router from '@koa/router';
import type { ViteDevServer } from 'vite';
import preRenderInit from './preDevRender.js';
import type { SweetOptions } from '../utils/types.js';

/* 错误处理 */
function errorCallback(ctx: Context, err: Error): void {
  ctx.status = 500;
  ctx.body = `<pre style="font-size: 14px; white-space: pre-wrap;">${ err?.stack?.toString?.() }</pre>`;
}

/* 服务器端渲染 */
async function serverRenderCallback(ctx: Context, sweetOptions: SweetOptions, ctxPath: string, preRender: Function): Promise<void> {
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
}

async function createRouters(router: Router, sweetOptions: SweetOptions): Promise<void> {
  const preRender: Function = await preRenderInit(sweetOptions);

  /* webpack 重定向 */
  async function webpackRedirectMiddleware(ctx: Context, next: Next): Promise<void> {
    try {
      const ctxPath: string = ctx.path;
      const mimeType: string | boolean = mime.lookup(ctxPath);

      ctx.state.routePath = ctxPath; // 保存旧的path

      // 重定向path，所有的路由都指向"/" TODO: webpack-hot-middleware
      if (ctxPath !== '/' && mimeType === false) {
        ctx.path = '/';
      }

      await next();

      ctx.path = ctxPath; // 将path改回重定向前的值

      await serverRenderCallback(ctx, sweetOptions, ctxPath, preRender);
    } catch (err) {
      errorCallback(ctx, err);
    }
  }

  /* vite 重定向 */
  async function viteRedirectMiddleware(ctx: Context, next: Next): Promise<void> {
    try {
      ctx.state.routePath = ctx.path; // 保存旧的path

      // 对vite路由的处理
      const isViteHtml: boolean = !/^\/@/i.test(ctx.path) && /^\s*$/.test(ctx.type) && !/\.jsx$/i.test(ctx.path);

      if (isViteHtml) {
        const isHtml: boolean = /\.html$/i.test(ctx.path);
        const compiler: ViteDevServer = sweetOptions.compiler as ViteDevServer;
        const viteRoot: string = compiler.config.root;
        const htmlFilepath: string = path.join(viteRoot, isHtml ? ctx.path : 'index.html');

        if (fs.existsSync(htmlFilepath)) {
          const html: string = await fs.promises.readFile(htmlFilepath, { encoding: 'utf8' });

          ctx.type = 'text/html';
          ctx.body = await compiler.transformIndexHtml(ctx.path, html);
        }
      }

      await serverRenderCallback(ctx, sweetOptions, ctx.path, preRender);

      if (!isViteHtml) {
        await next();
      }
      await next();
    } catch (err) {
      errorCallback(ctx, err);
    }
  }

  router.get(/^\/.*/, sweetOptions.vite ? viteRedirectMiddleware : webpackRedirectMiddleware);
}

export default createRouters;