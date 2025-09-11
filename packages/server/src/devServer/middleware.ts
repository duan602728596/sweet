import { koaBody } from 'koa-body';
import connect from 'koa-connect';
import type { Compiler } from 'webpack';
import type { ViteDevServer } from 'vite';
import type Koa from 'koa';
import type Router from '@koa/router';
import { requireCommonjsModule } from '@sweet-milktea/utils';
import type { SweetOptions } from '../utils/types.js';

/**
 * 创建中间件
 * @param { SweetOptions } sweetOptions
 * @param { Koa } app - koa实例
 * @param { Router } router - @koa/router实例
 * @param { Compiler } compiler - webpack compiler
 */
function middleware(sweetOptions: SweetOptions, app: Koa, router: Router, compiler: Compiler | ViteDevServer | undefined): void {
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
      app.use(requireCommonjsModule('webpack-dev-middleware').koaWrapper(compiler as Compiler, {
        serverSideRender: true,
        mimeTypes: {
          avifs: 'image/avif-sequence'
        }
      }));
    }
  }
}

export default middleware;