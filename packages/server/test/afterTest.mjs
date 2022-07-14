import util from 'node:util';
import path from 'node:path';
import rimraf from 'rimraf';
import { metaHelper } from '@sweet-milktea/utils/index.cjs';

const rimrafPromise = util.promisify(rimraf);
const { __dirname } = metaHelper(import.meta.url);

async function afterTest() {
  await Promise.all([
    rimrafPromise(path.join(__dirname, '../.sweet')),
    rimrafPromise(path.join(__dirname, 'dist'))
  ]);
}

export default afterTest;