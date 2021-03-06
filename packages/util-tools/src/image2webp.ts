import * as path from 'path';
import * as imageMin from 'imagemin';
import { requireModule, formatPath } from './utils';

interface Options {
  img?: object;
  gif?: object;
}

/**
 * 将图片批量转换成webp格式
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 * @param { Options } options: 图片转换的质量或配置
 */
async function image2webp(entry: string, output: string, options: Options = {}): Promise<any> {
  const imgOptions: object = { quality: 70 }; // 图片转换配置
  const gifOptions: object = { quality: 70 }; // gif转换配置

  // 合并配置
  Object.assign(imgOptions, options.img);
  Object.assign(gifOptions, options.gif);

  const imgFile: string = formatPath(path.join(entry, '**/*.{jpg,jpeg,png,gif}'));

  await imageMin([imgFile], {
    destination: output,
    plugins: [
      requireModule('imagemin-webp')(imgOptions),
      requireModule('imagemin-gif2webp')(gifOptions)
    ]
  });
}

export default image2webp;