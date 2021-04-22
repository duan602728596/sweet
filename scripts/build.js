/* gulp配置文件，编译packages下的所有文件 */
const path = require('path');
const gulp = require('gulp');
const typescript = require('gulp-typescript');
const rename = require('gulp-rename');
const tsconfig = require('../tsconfig.json');
const { dir, packageNames } = require('./config');

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
      value: prefix + '@' + name
    });

    queueFn.push(fn);
  }

  return queueFn;
}

exports.default = gulp.series(
  gulp.parallel(
    ...createQueue('commonjs', createProject, 'lib', tsBuildConfig),
    ...createQueue('module', createProject, 'esm', tsESMBuildConfig)
  ),
  gulp.parallel(...createQueue('esm', createESMProject, 'esm', tsESMBuildConfig))
);