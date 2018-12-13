import * as Koa from 'koa';
import * as brotli from 'iltorb';
import gzip from './gzip';
import buffer from './buffer';

function iltorb(): Function{
  return async function(ctx: Koa.Context, next: () => Promise<void>): Promise<void>{
    await next();

    const acceptEncoding: string = ctx.request.header['accept-encoding']; // 获取请求头的压缩参数
    const { body, type }: { body: Buffer | string, type: string } = ctx;           // 获取响应数据和文件的mime-type
    const input: Buffer = typeof body === 'string' ? buffer(body) : body;

    if(!/^image/i.test(type) && acceptEncoding){
      // 当数据类型不为图片时，执行压缩

      if(acceptEncoding.includes('br')){
        // 使用brotli压缩
        const output = await brotli.compress(input);

        ctx.set('Content-Encoding', 'br');
        ctx.body = output;
      }else if(acceptEncoding.includes('gzip')){
        // 使用gzip压缩
        const output = await gzip(input);

        ctx.set('Content-Encoding', 'gzip');
        ctx.body = output;
      }
    }
  };
}

export default iltorb;