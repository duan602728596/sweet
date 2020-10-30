import type { IncomingMessage } from 'http';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import type { Context, Middleware } from 'koa';
import type { Compiler } from 'webpack';

interface MiddlewareRequest {
  get: Function;
}

interface MiddlewareResponse {
  locals: any;
  set: Function;
  get: Function;
  send: Function;
  setHeader?: Function;
  end?: Function;
}

function middleware(wdm: Function, req: IncomingMessage, res: MiddlewareResponse): Promise<number> {
  const { send }: MiddlewareResponse = res;

  return new Promise((resolve: Function, reject: Function): void => {
    res.send = res.end = function(): void {
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

  async function koaMiddleware(ctx: Context, next: Function): Promise<void> {
    const { req, res }: Context = ctx;
    const locals: any = ctx.locals ?? ctx.state;

    ctx.webpack = wdm;

    // 创建兼容express的req
    const expressReq: MiddlewareRequest = {
      get(): string {
        return ctx.request.get.apply(ctx, arguments);
      }
    };

    // 创建兼容express的res
    const expressRes: MiddlewareResponse = {
      locals,

      // 设置响应头
      set(): void {
        ctx.set.apply(ctx, arguments);
      },

      // 获取请求头
      get(): string {
        return ctx.response.get.apply(ctx, arguments);
      },

      // 设置返回值
      send(content: any): void {
        ctx.body = content;
      }
    };

    // 合并req和res
    Object.assign(req, expressReq);
    Object.assign(res, expressRes, {
      setHeaders: expressRes.set,
      setHeader: expressRes.set,
      end: expressRes.send
    });

    const runNext: number = await middleware(wdm, req, expressRes);

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