const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const { dir, packageNames } = require('./config');

const configFile = path.join(__dirname, '../.babelrc');

function createProject(names){
  const src = path.join(dir, names, 'src/**/*.js');
  const dist = path.join(dir, names, 'lib');

  return function(){
    return gulp.src(src)
      .pipe(babel({
        configFile
      }))
      .pipe(gulp.dest(dist));
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

gulp.task('default', gulp.parallel(...queueFn));