import path from 'node:path';
import fse from 'fs-extra/esm';
import { dir, packageNames, __dirname } from './config.mjs';

const websiteCI = path.join(__dirname, '../.website-ci');

// 拷贝目录
await Promise.all(
  packageNames.map((name) => fse.copy(
    path.join(dir, name, 'README.md'),
    path.join(websiteCI, 'packages', name, 'README.md')
  )).concat([
    fse.copy(path.join(dir, 'website'), path.join(websiteCI, 'packages/website')),
    fse.copy(path.join(__dirname, '../tsconfig.json'), path.join(websiteCI, 'tsconfig.json')),
    fse.copy(path.join(__dirname, '../lerna.json'), path.join(websiteCI, 'lerna.json')),
    fse.copy(path.join(__dirname, '../README.md'), path.join(websiteCI, 'README.md'))
  ])
);