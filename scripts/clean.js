const path = require('path');
const rimraf = require('rimraf');
const { dir, packageNames } = require('./config');

function clean(filePath){
  return new Promise((resolve, reject)=>{
    rimraf(filePath, function(){
      resolve();
    });
  });
}

(async function(){
  const queue = [];

  for(let i = 0, j = packageNames.length; i < j; i++){
    const p = path.join(dir, packageNames[i], 'lib');

    queue.push(clean(p));
  }

  await Promise.all(queue);
})();