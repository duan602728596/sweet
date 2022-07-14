import * as path from 'node:path';
import type { ParsedPath } from 'node:path';
import fse from 'fs-extra';
import ffmpeg from 'fluent-ffmpeg';
import { formatPath, getFiles } from './utils/utils';

const defaultExt: string[] = ['gif', 'png', 'jpg', 'jpeg'];
const videoExt: string[] = ['mp4', 'flv', 'ts', 'mov', 'avi', 'mpg', 'mpeg'];

/**
 * 转换文件
 * @param { string } input
 * @param { string } output
 */
function file2webp(input: string, output: string): Promise<void> {
  return new Promise((resolve: Function, reject: Function): void => {
    const handleFFmpegEnd: Function = (): void => {
      resolve();
    };

    const handleFFmpegError: Function = (err: Error, stdout: string, stderr: string): void => {
      reject(err);
    };

    ffmpeg()
      .input(input)
      .outputOptions('-loop 0')
      .output(output)
      .on('error', handleFFmpegError)
      .on('end', handleFFmpegEnd)
      .run();
  });
}

/**
 * 将媒体批量转换成webp格式
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 * @param { boolean } video: 是否转换视频
 * @param { string[] } ext: 扩展名
 */
async function media2webp(entry: string, output: string, video: boolean = true, ext?: string[]): Promise<void> {
  // 获取所有文件
  const filesExt: string[] = [...defaultExt];

  if (video) filesExt.push(...videoExt);

  if (ext) filesExt.push(...ext);

  const files: string[] = await getFiles(entry, `**/*.{${ filesExt.join(',') }}`);

  for (const file of files) {
    const { dir, name }: ParsedPath = path.parse(file);
    const inputFile: string = formatPath(path.join(entry, file));
    const outputDir: string = path.join(output, dir);
    const outputFile: string = formatPath(path.join(outputDir, `${ name }.webp`));

    await fse.ensureDir(outputDir);
    await file2webp(inputFile, outputFile);
  }
}

export default media2webp;