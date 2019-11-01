import * as path from 'path';
import * as imageMin from 'imagemin';
import imageminPngquant, { Options as PngOptions } from 'imagemin-pngquant';
import * as imageminJpegoptim from 'imagemin-jpegoptim';
import * as imageminGifsicle from 'imagemin-gifsicle';
import * as _ from 'lodash';

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
  const p: string = path.join(entry, '**/*.{jpg,jpeg,png,gif}')
    .replace(/\\/g, '/');

  // 默认选项
  const pngCompressOptions: PngOptions | undefined = compressOptions.png;
  const jpgCompressOptions: object | undefined = compressOptions.jpg;
  const gifCompressOptions: object | undefined = compressOptions.gif;

  // 合并选项
  const pngOptions: PngOptions = _.merge({
    speed: 3
  }, pngCompressOptions);
  const jpgOptions: object = _.merge({
    max: 70
  }, jpgCompressOptions);
  const gifOptions: object = _.merge({
    optimizationLevel: 3
  }, gifCompressOptions);

  await imageMin([p], {
    destination: output,
    plugins: [
      imageminPngquant(pngOptions),
      imageminJpegoptim(jpgOptions),
      imageminGifsicle(gifOptions)
    ]
  });
}

export default imageCompress;