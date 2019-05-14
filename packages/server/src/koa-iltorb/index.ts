import * as Koa from 'koa';
import { Context } from 'koa';
import * as brotli from 'iltorb';
import * as _ from 'lodash';
import gzip from './gzip';
import { isReadStream, readStream } from '../utils/utils';

/* brotli压缩中间件 */
function iltorb(): Koa.Middleware {
  return async function(ctx: Context, next: Function): Promise<void> {
    await next();

    const acceptEncoding: string = ctx.request.header['accept-encoding']; // 获取请求头的压缩参数
    const { body }: { body: any } = ctx; // 获取响应数据
    let input: any = body;

    // 对文件进行判断
    if (!Buffer.isBuffer(body)) {
      if (isReadStream(body)) {
        // 此时的input是Stream对象，且只有本地文件能够被压缩
        if (input.path) {
          input = await readStream(input);
        }
      } else {
        // 字符串
        if (_.isString(body) || _.isNumber(body)) {
          input = Buffer.from(`${ body }`);
        }

        // 数组或对象
        if (_.isObject(body)) {
          try {
            input = Buffer.from(JSON.stringify(body));
          } catch (err) { /* err */ }
        }
      }
    }

    // 对文件进行压缩
    if (acceptEncoding && Buffer.isBuffer(input)) {
      let output: Buffer | null = null;

      if (acceptEncoding.includes('br')) {
        // 使用brotli压缩
        output = await brotli.compress(input);

        ctx.set('Content-Encoding', 'br');
      } else if (acceptEncoding.includes('gzip')) {
        // 使用gzip压缩
        output = await gzip(input);

        ctx.set('Content-Encoding', 'gzip');
      }

      ctx.body = output;
    }
  };
}

export default iltorb;