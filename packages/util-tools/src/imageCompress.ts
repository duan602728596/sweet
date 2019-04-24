import * as path from 'path';
import * as imageMin from 'imagemin';
import imageminPngquant from 'imagemin-pngquant';
import * as imageminJpegoptim from 'imagemin-jpegoptim';
import * as imageminGifsicle from 'imagemin-gifsicle';

/**
 * 批量压缩图片
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 */
async function imageCompress(entry: string, output: string): Promise<void> {
  await imageMin([path.join(entry, '*.{jpg,png,gif}')], output, {
    use: [
      imageminPngquant(),
      imageminJpegoptim(),
      imageminGifsicle()
    ]
  });
}

export default imageCompress;