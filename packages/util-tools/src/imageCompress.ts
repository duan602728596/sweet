import * as path from 'path';
import * as imageMin from 'imagemin';
import pngquant, { Options as PngOptions } from 'imagemin-pngquant';
import * as jpegoptim from 'imagemin-jpegoptim';
import * as gifsicle from 'imagemin-gifsicle';
import { formatPath } from './utils';

interface CompressOptions {
  png?: PngOptions;
  jpg?: object;
  gif?: object;
}

/**
 * 批量压缩图片
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 * @param { CompressOptions } compressOptions: 压缩选项
 */
async function imageCompress(entry: string, output: string, compressOptions: CompressOptions = {}): Promise<void> {
  const imgFile: string = formatPath(path.join(entry, '**/*.{jpg,jpeg,png,gif}'));

  // 默认选项
  const pngCompressOptions: PngOptions | undefined = compressOptions.png;
  const jpgCompressOptions: object | undefined = compressOptions.jpg;
  const gifCompressOptions: object | undefined = compressOptions.gif;

  // 合并选项
  const pngOptions: PngOptions = Object.assign({ speed: 3 }, pngCompressOptions);
  const jpgOptions: object = Object.assign({ max: 70 }, jpgCompressOptions);
  const gifOptions: object = Object.assign({}, gifCompressOptions);

  await imageMin([imgFile], {
    destination: output,
    plugins: [
      pngquant(pngOptions),
      jpegoptim(jpgOptions),
      gifsicle(gifOptions)
    ]
  });
}

export default imageCompress;