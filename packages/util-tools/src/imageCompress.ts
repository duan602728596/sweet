import * as path from 'node:path';
import { requireModule } from '@sweet-milktea/utils';
import imagemin from 'imagemin';
import type { Options as PngOptions } from 'imagemin-pngquant';
import { formatPath } from './utils/utils.js';

interface CompressOptions {
  png?: PngOptions;
  jpg?: object;
  gif?: object;
}

/**
 * 批量压缩图片
 * @param { string } entry - 入口文件夹
 * @param { string } output - 输出文件夹
 * @param { CompressOptions } [compressOptions = {}] - 压缩选项
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

  // 压缩
  await imagemin([imgFile], {
    destination: output,
    plugins: [
      (await requireModule('imagemin-pngquant'))(pngOptions),
      (await requireModule('imagemin-jpegoptim'))(jpgOptions),
      (await requireModule('imagemin-gifsicle'))(gifOptions)
    ]
  });
}

export default imageCompress;