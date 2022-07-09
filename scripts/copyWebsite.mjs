import fs, { promises as fsP } from 'node:fs';
import path from 'node:path';
import { dir, __dirname } from './config.mjs';

/**
 * 拷贝文件
 * @param { string } src
 * @param { string } dest
 */
async function copy(src, dest) {
  if (!fs.existsSync(src)) return;

  const stats = await fsP.stat(src);

  // 拷贝文件
  if (stats.isFile()) {
    await fsP.copyFile(src, dest);

    return;
  }

  // 拷贝文件夹
  await fsP.mkdir(dest);

  const dirs = await fsP.readdir(src);

  for (const childDir of dirs) {
    await copy(path.join(src, childDir), path.join(dest, childDir));
  }
}

await copy(
  path.join(dir, 'website'),
  path.join(__dirname, '../.website')
);