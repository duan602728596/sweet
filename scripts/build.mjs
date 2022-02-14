/* gulp配置文件，编译packages下的所有文件 */
import path from 'node:path';
import fs from 'node:fs';
import gulp from 'gulp';
import gulpTypescript from 'gulp-typescript';
import { ProjectCompiler as GulpTypescriptProjectCompiler } from 'gulp-typescript/release/compiler.js';
import gulpTypescriptUtils from 'gulp-typescript/release/utils.js';
import modifier from 'gulp-modifier';
import rename from 'gulp-rename';
import typescript from 'typescript';
import tsconfig from '../tsconfig.json' assert { type: 'json' };
import { dir, packageNames } from './config.mjs';

/**
 * fix: 重写 ProjectCompiler 的 attachContentToFile 方法
 *      用于支持mts和cts文件的编译
 */
GulpTypescriptProjectCompiler.prototype.attachContentToFile = function(file, fileName, content) {
  const [, extension] = gulpTypescriptUtils.splitExtension(fileName, ['d.ts', 'd.ts.map']);

  switch (extension) {
    case 'js':
    case 'jsx':
    case 'mjs':
    case 'cjs':
      file.jsFileName = fileName;
      file.jsContent = content;
      break;

    case 'd.ts.map':
      file.dtsMapFileName = fileName;
      file.dtsMapContent = content;
      break;

    case 'd.ts':
      file.dtsFileName = fileName;
      file.dtsContent = content;
      break;

    case 'map':
      file.jsMapContent = content;
      break;
  }
};

/* typescript编译配置 */
const tsBuildConfig = {
  ...tsconfig.compilerOptions,
  moduleResolution: 'Node12',
  module: 'Node12',
  skipLibCheck: true,
  typescript
};

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

/* rename */
function renameCallback(p) {
  if (p.extname === '.mjs' || p.extname === '.cjs') {
    p.extname = '.js';
  }
}

function createProject(name, out, cfg) {
  const isEsm = out === 'esm';
  const src = path.join(dir, name, isEsm ? 'src/**/*.{ts,mts}' : 'src/**/*.{ts,cts}');
  const dist = path.join(dir, name, out);

  return function() {
    const result = gulp.src(src)
      .pipe(gulpTypescript(cfg));

    if (isEsm) {
      return result.js
        .pipe(modifier(addJsExt))
        .pipe(rename(renameCallback))
        .pipe(gulp.dest(dist));
    } else {
      return result.js
        .pipe(rename(renameCallback))
        .pipe(gulp.dest(dist));
    }
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
  writeTypeModulePackageJsonFile
);