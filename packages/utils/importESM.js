const path = require('path');
const { pathToFileURL } = require('url');

/**
 * 异步加载ESM模块
 * 关于使用ESM模块的讨论：https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c
 * @param { string } id: 模块id
 * @return { Promise<any> }
 */
function importESM(id) {
  const fileUrl = (!id.includes('file://') && path.isAbsolute(id)) ? pathToFileURL(id).href : id;

  return import(fileUrl);
}

module.exports = importESM;
module.exports.default = importESM;