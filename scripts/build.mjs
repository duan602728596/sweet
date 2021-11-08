/* gulp配置文件，编译packages下的所有文件 */
import path from 'node:path';
import fs from 'node:fs';
import gulp from 'gulp';
import gulpTypescript from 'gulp-typescript';
import modifier from 'gulp-modifier';
import rename from 'gulp-rename';
import typescript from 'typescript';
import _ from 'lodash';
import tsconfig from '../tsconfig.json';
import { dir, packageNames } from './config.mjs';

/* typescript编译配置 */
const tsBuildConfig = _.omit({
  ...tsconfig.compilerOptions,
  // module: 'Node12', TODO: The official version is temporarily removed
  skipLibCheck: true,
  typescript
}, ['moduleResolution']);

const tsESMBuildConfig = {
  ...tsconfig.compilerOptions,
  skipLibCheck: true,
  typescript
};

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
    ) {
      contentsArr[index] = value.replace(/';$/, ".js';");
    }
  });

  return contentsArr.join('\n');
}

function createProject(name, out, cfg) {
  const src = path.join(dir, name, 'src/**/*.ts');
  const ignoreEsm = path.join(dir, name, 'src/**/*.esm.ts');
  const dist = path.join(dir, name, out);

  return function() {
    const result = gulp.src([src, `!${ ignoreEsm }`])
      .pipe(gulpTypescript(cfg));

    if (out === 'esm') {
      return result.js
        .pipe(modifier(addJsExt))
        .pipe(gulp.dest(dist));
    } else {
      return result.js.pipe(gulp.dest(dist));
    }
  };
}

function createESMProject(name, out, cfg) {
  const src = path.join(dir, name, 'src/**/*.esm.ts');
  const dist = path.join(dir, name, out);

  return function() {
    const result = gulp.src(src)
      .pipe(gulpTypescript(cfg));

    return result.js
      .pipe(modifier(addJsExt))
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

export default gulp.series(
  gulp.parallel(
    ...createQueue('commonjs', createProject, 'lib', tsBuildConfig),
    ...createQueue('esm'.padEnd(8), createProject, 'esm', tsESMBuildConfig)
  ),
  gulp.parallel(...createQueue('esm file', createESMProject, 'esm', tsESMBuildConfig)),
  writeTypeModulePackageJsonFile
);