import * as path from 'node:path';
import { koaBody } from 'koa-body';
import connect from 'koa-connect';
import type { Compiler } from 'webpack';
import type { ViteDevServer } from 'vite';
import type Koa from 'koa';
import type Router from '@koa/router';
import { requireModule, metaHelper } from '@sweet-milktea/utils';
import type { SweetOptions } from '../utils/types.js';

const { __dirname }: { __filename: string; __dirname: string } = metaHelper(import.meta.url);

/* 加载插件 */
function requireKoaDevMiddleware<T = unknown>(id: string): Promise<T> {
  return requireModule(path.join(__dirname, id));
}

/**
 * 创建中间件
 * @param { SweetOptions } sweetOptions
 * @param { Koa } app: koa实例
 * @param { Router } router: @koa/router实例
 * @param { Compiler } compiler: webpack compiler
 */
async function middleware(
  sweetOptions: SweetOptions,
  app: Koa,
  router: Router,
  compiler: Compiler | ViteDevServer | undefined
): Promise<void> {
  /* post body */
  app.use(koaBody());

  /* router */
  app.use(router.routes())
    .use(router.allowedMethods());

  if (compiler !== undefined) {
    if (sweetOptions.vite) {
      // vite服务
      app.use(connect((compiler as ViteDevServer).middlewares));
    } else {
      // 异步加载webpack热替换服务
      app.use((await requireKoaDevMiddleware<Function>('koaDevMiddleware.js'))(
        compiler as Compiler,
        {
          serverSideRender: true,
          mimeTypes: {
            avifs: 'image/avif-sequence'
          }
        }
      ));
    }
  }
}

export default middleware;