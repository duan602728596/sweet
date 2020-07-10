import * as url from 'url';
import * as Koa from 'koa';
import type { Context } from 'koa';
import type { SweetOptions } from './types';

/* 307重定向到https */
function createRedirectToHttpsMiddleware(app: Koa, sweetOptions: SweetOptions): void {
  app.use(async function(ctx: Context, next: Function): Promise<void> {
    const urlResult: url.URL = new url.URL(ctx.request.href);

    if (urlResult.protocol === 'http:') {
      // 修改协议为https
      urlResult.protocol = 'https:';

      // 修改端口
      if (sweetOptions.httpsPort !== 443) {
        urlResult.port = String(sweetOptions.httpsPort);
      }

      ctx.status = 307;
      ctx.set({
        Location: urlResult.href,
        'Non-Authoritative-Reason': 'HSTS'
      });

      return;
    }

    await next();
  });
}

export default createRedirectToHttpsMiddleware;