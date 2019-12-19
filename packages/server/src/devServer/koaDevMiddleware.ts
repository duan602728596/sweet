import { IncomingMessage } from 'http';
import * as devMiddleware from 'webpack-dev-middleware';
import { Context, Middleware } from 'koa';
import { Compiler } from 'webpack';

interface MiddlewareResponse {
  end: Function;
  locals: any;
  setHeader: Function;
}

function middleware(doIt: Function, req: IncomingMessage, res: MiddlewareResponse): Promise<number> {
  const { end: originalEnd }: MiddlewareResponse = res;

  return new Promise((resolve: Function, reject: Function): void => {
    res.end = function end(): void {
      originalEnd.apply(this, arguments);
      resolve(0);
    };

    doIt(req, res, () => {
      resolve(1);
    });
  });
}

function koaDevMiddleware(compiler: Compiler, options: { [key: string]: any }): Middleware {
  const doIt: Function = devMiddleware(compiler, options);

  async function koaMiddleware(ctx: Context, next: Function): Promise<void> {
    const { req }: Context = ctx;
    const locals: any = ctx.locals || ctx.state;

    ctx.webpack = doIt;

    const runNext: number = await middleware(doIt, req, {
      end(content: any): void {
        ctx.body = content;
      },
      locals,
      setHeader(): void {
        ctx.set.apply(ctx, arguments);
      }
    });

    if (runNext) {
      await next();
    }
  }

  Object.keys(doIt).forEach((p: any): void => {
    koaMiddleware[p] = doIt[p];
  });

  return koaMiddleware;
}

export default koaDevMiddleware;