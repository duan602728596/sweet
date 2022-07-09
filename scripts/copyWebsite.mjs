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

  await Promise.all(
    dirs.map((childDir) => copy(path.join(src, childDir), path.join(dest, childDir)))
  );
}

/**
 * 修改tsconfig文件
 * @param { string } config
 */
async function tsconfigEdit(config) {
  const configString = await fsP.readFile(config, 'utf8');
  const configJson = JSON.parse(configString);

  configJson.extends = '../tsconfig.json';
  await fsP.writeFile(config, JSON.stringify(configJson, null, 2));
}

// 拷贝文件夹
await copy(path.join(dir, 'website'), path.join(__dirname, '../.website'));

// 修改tsconfig.json文件
await Promise.all([
  tsconfigEdit(path.join(__dirname, '../.website/tsconfig.json')),
  tsconfigEdit(path.join(__dirname, '../.website/tsconfig.prod.json'))
]);