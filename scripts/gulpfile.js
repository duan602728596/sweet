/* gulp配置文件，编译packages下的所有文件 */
const path = require('path');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const tsconfig = require('../tsconfig.json');
const { dir, packageNames } = require('./config');

function createProject(names){
  const src = path.join(dir, names, 'src/**/*.ts');
  const dist = path.join(dir, names, 'lib');

  return function(){
    const result = gulp.src(src)
      .pipe(typescript(tsconfig.compilerOptions));

    return result.js.pipe(gulp.dest(dist));
  }
}

/* 创建队列函数 */
const queueFn = [];

for(const item of packageNames){
  const fn = createProject(item);

  Object.defineProperty(fn, 'name', {
    value: item
  });

  queueFn.push(fn);
}

exports.default = gulp.series(gulp.parallel(...queueFn));