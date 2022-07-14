import * as path from 'node:path';
import type { ParsedPath } from 'node:path';
import { spawn, ChildProcessWithoutNullStreams } from 'node:child_process';
import fse from 'fs-extra';
import { requireModule, moduleExists } from '@sweet-milktea/utils';
import type Sharp from 'sharp';
import { formatPath, getFiles } from './utils/utils';

/**
 * 转换成avif：https://reachlightspeed.com/blog/using-the-new-high-performance-avif-image-format-on-the-web-today/
 *
 * If you are comfortable in the command line, you can use the offical AOMedia library, libavif, to encode/decode AVIF files.
 * Also, if you're a macOS user with Homebrew, you can quickly install a pre-built version using brew install joedrago/repo/avifenc,
 * and avifenc --help for syntax and options.
 *
 * @param { string } inputFile: 输入的图片文件
 * @param { string } outputFile: 输出的图片文件
 * @param { boolean } hiddenLog: 隐藏日志
 */
function toAvif(inputFile: string, outputFile: string, hiddenLog?: boolean): Promise<void> {
  return new Promise((resolve: Function, reject: Function): void => {
    const handleOutput: (chunk: Buffer) => void = function(chunk: Buffer): void {
      if (!hiddenLog) {
        console.log(chunk.toString());
      }
    };

    const child: ChildProcessWithoutNullStreams = spawn('avifenc', [
      '--jobs',
      '4',
      inputFile,
      outputFile
    ]);

    child.stdout.on('data', handleOutput);
    child.stderr.on('data', handleOutput);
    child.on('close', function(): void {
      resolve();
    });
    child.on('error', function(err: Error): void {
      reject(err);
    });
  });
}

/**
 * 转换成avif，使用sharp
 * @param { string } inputFile: 输入的图片文件
 * @param { string } outputFile: 输出的图片文件
 */
export async function toAvifUseSharp(inputFile: string, outputFile: string): Promise<void> {
  const sharp: typeof Sharp = await requireModule('sharp');

  await sharp(inputFile).toFile(outputFile);
}

/**
 * 图片批量转换成avif格式
 * @param { string } entry: 入口文件夹
 * @param { string } output: 输出文件夹
 * @param { 'avifenc' | 'sharp' } type: 转换的底层依赖
 * @param { boolean } hiddenLog: 隐藏日志
 */
async function image2avif(entry: string, output: string, type?: 'avifenc' | 'sharp', hiddenLog?: boolean): Promise<void> {
  const files: string[] = await getFiles(entry, '**/*.{jpg,jpeg,png,y4m}');

  for (const file of files) {
    const { dir, name }: ParsedPath = path.parse(file);
    const inputFile: string = formatPath(path.join(entry, file));
    const outputDir: string = path.join(output, dir);
    const outputFile: string = formatPath(path.join(outputDir, `${ name }.avif`));

    await fse.ensureDir(outputDir);

    if (type === 'avifenc' || moduleExists('sharp') === false) {
      await toAvif(inputFile, outputFile, hiddenLog);
    } else {
      await toAvifUseSharp(inputFile, outputFile);
    }
  }
}

export default image2avif;