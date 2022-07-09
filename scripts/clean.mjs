/* 清除已编译的代码 */
import util from 'node:util';
import path from 'node:path';
import rimraf from 'rimraf';
import { dir, packageNames } from './config.mjs';

const rimrafPromise = util.promisify(rimraf);

async function clean() {
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

clean();