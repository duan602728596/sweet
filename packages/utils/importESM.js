const { pathToFileURL } = require('url');

/**
 * 异步加载ESM模块
 * @param { string } id: 模块id
 * @return { Promise<any> }
 */
function importESM(id) {
  const fileUrl = id.includes('file://') ? id : pathToFileURL(id).href;

  return import(fileUrl);
}

module.exports = importESM;
module.exports.default = importESM;