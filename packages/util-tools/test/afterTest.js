import util from 'util';
import path from 'path';
import rimraf from 'rimraf';

const rimrafPromise = util.promisify(rimraf);

async function afterTest() {
  await rimrafPromise(path.join(__dirname, '/**/output'));
}

export default afterTest;