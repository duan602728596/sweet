/* 清除已编译的代码 */
import path from 'node:path';
import { rimraf } from 'rimraf';
import { dir, packageNames } from './config.mjs';

async function clean() {
  const queue = [];

  for (const packageName of packageNames) {
    const packageDir = path.join(dir, packageName, 'lib');
    const packageEsmDir = path.join(dir, packageName, 'esm');
    const packageCjsDir = path.join(dir, packageName, 'cjs');

    queue.push(
      rimraf(packageDir),
      rimraf(packageEsmDir),
      rimraf(packageCjsDir)
    );
  }

  await Promise.all(queue);
}

clean();