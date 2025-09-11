import * as path from 'node:path';
import type { ParsedPath } from 'node:path';
import type { Context, Middleware, Next } from 'koa';

/**
 * 重写mime types
 * @param { object } [mime = {}] - 重写的mime
 */
function createRewriteMime(mime: { [key: string]: string } = {}): Middleware {
  return async function(ctx: Context, next: Next): Promise<void> {
    await next();

    if (!(ctx.type && ctx.type !== '')) {
      const parseResult: ParsedPath = path.parse(ctx.url);
      const ext: string = parseResult.ext.replace(/^\./, '');

      if (mime[ext] && mime[ext] !== '') {
        ctx.type = mime[ext];
      }
    }
  };
}

export default createRewriteMime;