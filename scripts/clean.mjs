/* 清除已编译的代码 */
import util from 'util';
import path from 'path';
import rimraf from 'rimraf';
import { dir, packageNames } from './config.mjs';

const rimrafPromise = util.promisify(rimraf);

async function main() {
  const queue = [];

  for (const packageName of packageNames) {
    const packageDir = path.join(dir, packageName, 'lib');
    const packageESMDir = path.join(dir, packageName, 'esm');

    queue.push(
      rimrafPromise(packageDir),
      rimrafPromise(packageESMDir)
    );
  }

  await Promise.all(queue);
}

main();