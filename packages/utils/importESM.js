const path = require('path');
const { pathToFileURL } = require('url');

/**
 * 异步加载ESM模块
 * @param { string } id: 模块id
 * @return { Promise<any> }
 */
function importESM(id) {
  const fileUrl = (!id.includes('file://') && path.isAbsolute(id)) ? pathToFileURL(id).href : id;

  return import(fileUrl);
}

module.exports = importESM;
module.exports.default = importESM;