import * as path from 'path';
import * as imageMin from 'imagemin';
import * as imageMinWebP from 'imagemin-webp';

/**
 * 将图片批量转换成webp格式
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 */
async function image2webp(entry: string, output: string): Promise<any>{
  await imageMin([path.join(entry, '*.{jpg,png,jpeg}')], output, {
    use: [
      imageMinWebP()
    ]
  });
}

export default image2webp;