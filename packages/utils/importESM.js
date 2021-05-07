/**
 * 异步加载ESM模块
 * @param { string } id: 模块id
 * @return { Promise<any> }
 */
function importESM(id) {
  return import(id);
}

module.exports = importESM;
module.exports.default = importESM;