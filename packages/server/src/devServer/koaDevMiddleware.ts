import type { IncomingMessage, ServerResponse } from 'http';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import type { Context, Middleware, Next } from 'koa';
import type { Compiler } from 'webpack';

function middleware(wdm: Function, req: IncomingMessage, res: ServerResponse): Promise<number> {
  const send: (content: any) => void = res['send'];

  return new Promise((resolve: Function, reject: Function): void => {
    res['send'] = function(): void {
      send.apply(this, arguments);
      resolve(0);
    };

    wdm(req, res, (): void => {
      resolve(1);
    });
  });
}

function koaDevMiddleware(compiler: Compiler, options: { [key: string]: any }): Middleware {
  const wdm: Function = webpackDevMiddleware(compiler, options);

  async function koaMiddleware(ctx: Context, next: Next): Promise<void> {
    const { req, res }: Context = ctx;
    const locals: any = ctx.locals ?? ctx.state;

    ctx.webpack = wdm;

    // 合并req和res
    Object.assign(req, {
      get(): string {
        return ctx.request.get.apply(ctx, arguments);
      }
    });

    Object.assign(res, {
      locals,

      // 设置响应头
      set(): void {
        ctx.set.apply(ctx, arguments);
      },

      // 获取响应头
      get(): string {
        return ctx.response.get.apply(ctx, arguments);
      },

      // 设置返回值
      send(content: any): void {
        ctx.body = content;
      },

      // 设置status
      status(code: number): void {
        ctx.status = code;
      }
    });

    const runNext: number = await middleware(wdm, req, res);

    if (runNext) {
      await next();
    }
  }

  Object.keys(wdm).forEach((key: string): void => {
    koaMiddleware[key] = wdm[key];
  });

  return koaMiddleware;
}

export default koaDevMiddleware;