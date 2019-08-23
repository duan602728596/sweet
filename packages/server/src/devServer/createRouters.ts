import * as Router from '@koa/router';
import * as mime from 'mime-types';
import preRenderInit from './preDevRender';
import { ServerContext, SweetOptions } from '../utils/types';

function createRouters(
  router: Router,
  sweetOptions: SweetOptions,
  serverRender: boolean,
  formatServerRenderFile: string
): void {
  const preRender: Function = preRenderInit(sweetOptions);

  /* webpack 重定向 */
  router.get(/^\/[^._\-]*$/, async (ctx: ServerContext, next: Function): Promise<void> => {
    const ctxPath: string = ctx.path;
    const mimeType: string | boolean = mime.lookup(ctxPath);

    // 重定向path，所有的路由都指向"/"
    if (ctxPath !== '/' && mimeType === false) {
      ctx.path = '/';
      ctx._path = ctxPath;     // TODO: 未来移除
      ctx.routePath = ctxPath; // 保存旧的path
    }

    await next();

    // 将path改回重定向前的值
    ctx.path = ctxPath;

    // 服务器端渲染
    if (serverRender && ctx.type === 'text/html') {
      ctx.body = await preRender(ctxPath, ctx, formatServerRenderFile);
    }
  });

  /* html文件允许使用ejs模板 */
  router.get(/^.*\.html$/, async (ctx: ServerContext, next: Function): Promise<void> => {
    const ctxPath: string = ctx.path;

    await next();

    // 服务器端渲染
    if (serverRender) {
      ctx.body = await preRender(ctxPath, ctx, formatServerRenderFile);
    }
  });
}

export default createRouters;