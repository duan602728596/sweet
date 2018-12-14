import * as Koa from 'koa';
import * as brotli from 'iltorb';
import gzip from './gzip';
import { readFile, isReadStream } from '../utils/utils';

function iltorb(): Koa.Middleware{
  return async function(ctx: Koa.Context, next: () => Promise<void>): Promise<void>{
    await next();

    const acceptEncoding: string = ctx.request.header['accept-encoding']; // 获取请求头的压缩参数
    const { body }: { body: Buffer | string } = ctx;                      // 获取响应数据
    let input: any = body;

    if(!Buffer.isBuffer(input)){
      // 兼容staticCache缓存
      if(isReadStream(input)){
        input = await readFile(input.path); // 此时的input是ReadStream对象
      }else{
        // 字符串
        if(typeof body === 'string' || typeof body === 'number') input = Buffer.from(`${ body }`);

        // 数组或对象
        if(typeof body === 'object') input = Buffer.from(JSON.stringify(body));
      }
    }

    if(acceptEncoding && Buffer.isBuffer(input)){
      let output: Buffer = null;

      if(acceptEncoding.includes('br')){
        // 使用brotli压缩
        output = await brotli.compress(input);

        ctx.set('Content-Encoding', 'br');
      }else if(acceptEncoding.includes('gzip')){
        // 使用gzip压缩
        output = await gzip(input);

        ctx.set('Content-Encoding', 'gzip');
      }

      ctx.body = output;
    }
  };
}

export default iltorb;