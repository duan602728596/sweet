import util from 'util';
import path from 'path';
import rimraf from 'rimraf';

const rimrafPromise = util.promisify(rimraf);

async function afterTest() {
  await Promise.all([
    rimrafPromise(path.join(__dirname, '../.sweet')),
    rimrafPromise(path.join(__dirname, 'dist'))
  ]);
}

export default afterTest;