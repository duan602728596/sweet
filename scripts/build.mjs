/* global path, fs, globby, cd, $ */
import os from 'node:os';
import { dir, packageNames } from './config.mjs';

/* 修复window下bash的错误 */
if (os.platform() === 'win32') {
  $.quote = function(arg) {
    if (/^[a-z\d/_.-]+$/i.test(arg) || arg === '') {
      return arg;
    }

    return arg.replace(/\\/g, '\\\\')
      .replace(/'/g, '\\\'')
      .replace(/\f/g, '\\f')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t')
      .replace(/\v/g, '\\v')
      .replace(/\0/g, '\\0');
  };
}

/**
 * 格式化路径
 * @param { string } p - 原始路径
 */
function formatPath(p) {
  return p.replace(/\\/g, '/');
}

/**
 * typescript文件处理
 * @param { string } packageName - 编译名称
 * @param { string } packageDir - 入口文件
 */
async function clean(packageName, packageDir) {
  const libDir = path.join(packageDir, 'lib');
  const esmDir = path.join(packageDir, 'esm');

  cd(packageDir);
  await Promise.all([
    // 移除lib文件夹中的mjs文件和esm中的cjs文件
    (async () => {
      const deleteFiles = await globby([
        formatPath(path.join(libDir, '**/*.mjs')),
        formatPath(path.join(esmDir, '**/*.cjs'))
      ]);

      await Promise.all(deleteFiles.map((file) => fs.promises.rm(file)));
    })(),

    // 将mjs和cjs文件修改为js文件
    (async () => {
      const renameFiles = await globby([
        formatPath(path.join(libDir, '**/*.cjs')),
        formatPath(path.join(esmDir, '**/*.mjs'))
      ]);

      await Promise.all(
        renameFiles.map((file) => {
          const parseResult = path.parse(file);

          return fs.promises.rename(file, `${ parseResult.dir }/${ parseResult.name }.js`);
        })
      );
    })()
  ]);
}

await Promise.all(packageNames.map((packageName) => clean(packageName, path.join(dir, packageName))));

/* 写入package.js文件 */
async function writeTypeModulePackageJsonFile() {
  for (const name of packageNames) {
    if (['babel-preset-sweet', 'utils'].includes(name) ) {
      await fs.promises.writeFile(
        path.join(dir, name, 'esm/package.json'),
        JSON.stringify({ type: 'module' }, null, 2) + '\n'
      );
    }
  }
}

await writeTypeModulePackageJsonFile();