/* gulp配置文件，编译packages下的所有文件 */
const util = require('util');
const path = require('path');
const fs = require('fs');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const glob = require('glob');
const tsconfig = require('../tsconfig.json');
const { dir, packageNames } = require('./config');

const globPromise = util.promisify(glob);

const tsBuildConfig = {
  ...tsconfig.compilerOptions,
  module: 'commonjs',
  skipLibCheck: true
};

const tsESMBuildConfig = {
  ...tsconfig.compilerOptions,
  skipLibCheck: true
};

function createProject(name, out, cfg) {
  const src = path.join(dir, name, 'src/**/*.ts');
  const ignoreEsm = path.join(dir, name, 'src/**/*.esm.ts');
  const dist = path.join(dir, name, out);

  return function() {
    const result = gulp.src([src, `!${ ignoreEsm }`])
      .pipe(typescript(cfg));

    return result.js.pipe(gulp.dest(dist));
  };
}

function createESMProject(name, out, cfg) {
  const src = path.join(dir, name, 'src/**/*.esm.ts');
  const dist = path.join(dir, name, out);

  return function() {
    const result = gulp.src(src)
      .pipe(typescript(cfg));

    return result.js
      .pipe(rename(function(p) {
        p.basename = p.basename.replace(/\.esm$/, '');
      }))
      .pipe(gulp.dest(dist));
  };
}

/* 创建队列函数 */
function createQueue(prefix, func, out, cfg) {
  const queueFn = [];

  for (const name of packageNames) {
    const fn = func(name, out, cfg);

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
    await fs.promises.writeFile(
      path.join(dir, name, 'esm/package.json'),
      JSON.stringify({ type: 'module' }, null, 2) + '\n'
    );
  }
}

/* 添加文件扩展名 */
async function addJsExt() {
  for (const name of packageNames) {
    const files = await globPromise(path.join(dir, name, 'esm/**/*.js'));

    for (const file of files) {
      const text = await fs.promises.readFile(file, { encoding: 'utf8' });
      const textArr = text.split(/\n/);

      textArr.forEach(function(value, index) {
        if (
          (/^import /.test(value) || /^export {/.test(value))
          && (/from '\./.test(value) || /import '\./.test(value) || /from 'sockjs\/lib/.test(value))
        ) {
          const newValue = value.replace(/';$/, ".js';");

          textArr[index] = newValue;
        }
      });

      await fs.promises.writeFile(file, textArr.join('\n'));
    }
  }
}

exports.default = gulp.series(
  gulp.parallel(
    ...createQueue('commonjs', createProject, 'lib', tsBuildConfig),
    ...createQueue('esm'.padEnd(8), createProject, 'esm', tsESMBuildConfig)
  ),
  gulp.parallel(...createQueue('esm file', createESMProject, 'esm', tsESMBuildConfig)),
  gulp.parallel(writeTypeModulePackageJsonFile, addJsExt)
);