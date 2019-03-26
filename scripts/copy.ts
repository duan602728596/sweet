import * as path from 'path';
import * as fse from 'fs-extra';
import { dir, packageNames } from './config';

/* 删除 */
function removeFiles(file: string): Promise<void> {
  return fse.remove(file);
}

/* 拷贝 */
function copyFiles(from: string, to: string): Promise<void> {
  return fse.copy(from, to);
}

async function start(): Promise<void> {
  const father: string = path.join(__dirname, '../../');
  const delQueue: Promise<void>[] = [];
  const copyQueue: Promise<void>[] = [];

  // 删除文件
  for (const item of packageNames) {
    const build: string = path.join(father, `build-${ item }`);

    delQueue.push(removeFiles(path.join(build, 'lib')));
    delQueue.push(removeFiles(path.join(build, 'package.json')));
    delQueue.push(removeFiles(path.join(build, 'README.md')));
  }

  await Promise.all(delQueue);

  // 拷贝文件
  for (const item of packageNames) {
    const pack: string = path.join(dir, item);
    const build: string = path.join(father, `build-${ item }`);

    copyQueue.push(copyFiles(path.join(pack, 'lib'), path.join(build, 'lib')));
    copyQueue.push(copyFiles(path.join(pack, 'package.json'), path.join(build, 'package.json')));
    copyQueue.push(copyFiles(path.join(pack, 'README.md'), path.join(build, 'README.md')));
  }

  await Promise.all(copyQueue);
}

start();