/* gulp配置文件，编译packages下的所有文件 */
import path from 'node:path';
import fs from 'node:fs';
import gulp from 'gulp';
import modifier from 'gulp-modifier';
import { dir, packageNames } from './config.mjs';

/* 修改文件的内容 */
function addJsExt(contents, p) {
  const contentsArr = contents.split(/\n/);

  contentsArr.forEach(function(value, index) {
    if (
      (/^import /.test(value) || /^export {/.test(value))
      && (
        /from '\./.test(value)
        || /import '\./.test(value)
        || /from 'sockjs\/lib/.test(value) // sockjs
        || /from '@typescript-eslint\/eslint-plugin\/dist/.test(value) // typescript-eslint
      )
      && !/\.(m|c)?js['"];?$/.test(value)
    ) {
      contentsArr[index] = value.replace(/';$/, ".js';");
    }
  });

  return contentsArr.join('\n');
}

function createProject(name) {
  const src = path.join(dir, name, 'esm');

  return function() {
    return gulp.src(path.join(src, '**/*.js'))
      .pipe(modifier(addJsExt))
      .pipe(gulp.dest(src));
  };
}

/* 创建队列函数 */
function createQueue(prefix, func) {
  const queueFn = [];

  for (const name of packageNames) {
    if (name === 'eslint-plugin') {
      continue;
    }

    const fn = func(name);

    Object.defineProperty(fn, 'name', {
      value: `${ prefix } | ${ name }`
    });

    queueFn.push(fn);
  }

  return queueFn;
}

/* 写入package.js文件 */
async function writeTypeModulePackageJsonFile() {
  for (const name of packageNames) {
    if (name !== 'eslint-plugin') {
      await fs.promises.writeFile(
        path.join(dir, name, 'esm/package.json'),
        JSON.stringify({ type: 'module' }, null, 2) + '\n'
      );
    }
  }
}

export default gulp.series(
  gulp.parallel(...createQueue('esm', createProject)),
  writeTypeModulePackageJsonFile
);