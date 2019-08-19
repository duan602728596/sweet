const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

function readFile(p) {
  return new Promise((resolve, reject) => {
    fs.readFile(p, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.toString());
      }
    });
  }).catch((err) => {
    console.error(err);
  });
}

/**
 * 重写StoryBook的title
 */
(async function() {
  const title = 'sweet';
  const replaceStr = '<title>Storybook</title>';
  const indexFile = path.join(__dirname, '../storybook-static/index.html');
  const iframeFile = path.join(__dirname, '../storybook-static/iframe.html');

  // 读取文件
  const [indexData, iframeData] = await Promise.all([
    readFile(indexFile),
    readFile(iframeFile)
  ]);

  // 重写文件
  const [formatIndexData, formatIframeData] = [
    indexData.replace(replaceStr, `<title>${ title }</title>`),
    iframeData.replace(replaceStr, `<title>${ title }</title>`)
  ];

  // 写入文件
  await Promise.all([
    fse.outputFile(indexFile, formatIndexData),
    fse.outputFile(iframeFile, formatIframeData)
  ]);
})();