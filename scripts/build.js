/* gulp配置文件，编译packages下的所有文件 */
const path = require('path');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const tsconfig = require('../tsconfig.json');
const { dir, packageNames } = require('./config');

const tsBuildConfig = {
  ...tsconfig.compilerOptions,
  skipLibCheck: true
};

function createProject(name) {
  const src = path.join(dir, name, 'src/**/*.ts');
  const dist = path.join(dir, name, 'lib');

  return function() {
    const result = gulp.src(src)
      .pipe(typescript(tsBuildConfig));

    return result.js.pipe(gulp.dest(dist));
  };
}

/* 创建队列函数 */
const queueFn = [];

for (const name of packageNames) {
  const fn = createProject(name);

  Object.defineProperty(fn, 'name', {
    value: name
  });

  queueFn.push(fn);
}

exports.default = gulp.series(gulp.parallel(...queueFn));