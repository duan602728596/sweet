import * as path from 'path';
import * as imageMin from 'imagemin';
import * as imageMinWebP from 'imagemin-webp';
import { formatPath } from './utils';

/**
 * 将图片批量转换成webp格式
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 * @param { number } quality: 图片转换的质量
 */
async function image2webp(entry: string, output: string, quality?: number): Promise<any> {
  const q: number = typeof quality !== 'number' ? 70 : quality;
  const imgFile: string = formatPath(path.join(entry, '**/*.{jpg,jpeg,png}'));

  await imageMin([imgFile], {
    destination: output,
    plugins: [
      imageMinWebP({
        quality: q
      })
    ]
  });
}

export default image2webp;