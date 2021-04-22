/* 清除已编译的代码 */
const util = require('util');
const path = require('path');
const rimraf = require('rimraf');
const { dir, packageNames } = require('./config');

const rimrafPromise = util.promisify(rimraf);

async function main() {
  const queue = [];

  for (const packageName of packageNames) {
    const packageDir = path.join(dir, packageName, 'lib');

    queue.push(rimrafPromise(packageDir));
  }

  for (const packageName of packageNames) {
    const packageDir = path.join(dir, packageName, 'esm/**/*.js');

    queue.push(rimrafPromise(packageDir));
  }

  await Promise.all(queue);
}

main();