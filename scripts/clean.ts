/* 清除已编译的代码 */
import * as path from 'path';
import * as rimraf from 'rimraf';
import { dir, packageNames } from './config';

function clean(filePath: string): Promise<void> {
  return new Promise((resolve: Function, reject: Function): void => {
    rimraf(filePath, function(): void {
      resolve();
    });
  });
}

async function start(): Promise<void> {
  const queue: Promise<void>[] = [];

  for (let i: number = 0, j: number = packageNames.length; i < j; i++) {
    const p: string = path.join(dir, packageNames[i], 'lib');

    queue.push(clean(p));
  }

  await Promise.all(queue);
}

start();