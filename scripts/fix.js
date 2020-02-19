/* 编译过程中的修复脚本 */
const fs = require('fs');
const path = require('path');

async function httpProxyMiddleware() {
  const file = path.join(__dirname, '../node_modules/http-proxy-middleware/dist/types.d.ts');
  const data = await fs.promises.readFile(file, { encoding: 'utf8' });
  const dataArr = data.split(/\n/g);

  [1, 2, 3, 4].forEach(function(value, index) {
    if (!/^import \* as/.test(dataArr[value])) {
      dataArr[value] = dataArr[value].replace(/^import/, 'import * as');
    }
  });

  await fs.promises.writeFile(file, dataArr.join('\n'));
}

async function main() {
  await httpProxyMiddleware();
}

main();