import * as glob from 'glob';
import * as ffmpegPath from '@ffmpeg-installer/ffmpeg';
import * as fluentffmpeg from 'fluent-ffmpeg';

/**
 * 格式化路径
 * @param { string } p: 原始路径
 */
export function formatPath(p: string): string {
  return p.replace(/\\/g, '/');
}

/**
 * 获取所有文件
 */
export function getFiles(cwd: string, file: string): Promise<string[]> {
  return new Promise((resolve: Function, reject: Function): void => {
    glob(file, { cwd }, function(err: Error | null, files: string[]): void {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}


/* ffmpeg */
fluentffmpeg.setFfmpegPath(ffmpegPath.path);

export const ffmpeg: any = fluentffmpeg;