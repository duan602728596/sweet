/* gulp配置文件，编译packages下的所有文件 */
import * as path from 'path';
import { Stream } from 'stream';
import * as gulp from 'gulp';
import * as typescript from 'gulp-typescript';
import { ICompileStream } from 'gulp-typescript/release/project';
import * as tsconfig from '../tsconfig.json';
import { dir, packageNames } from './config';

function createProject(names: string): Function {
  const src: string = path.join(dir, names, 'src/**/*.ts');
  const dist: string = path.join(dir, names, 'lib');

  return function(): Stream {
    const result: ICompileStream = gulp.src(src)
      .pipe(typescript(tsconfig.compilerOptions));

    return result.js.pipe(gulp.dest(dist));
  };
}

/* 创建队列函数 */
const queueFn: Function[] = [];

for (const item of packageNames) {
  const fn: Function = createProject(item);

  Object.defineProperty(fn, 'name', {
    value: item
  });

  queueFn.push(fn);
}

export default gulp.series(gulp.parallel(...queueFn));