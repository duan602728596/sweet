import util from 'util';
import path from 'path';
import rimraf from 'rimraf';
import { metaHelper } from '@sweet-milktea/utils';

const rimrafPromise = util.promisify(rimraf);
const { __dirname } = metaHelper(import.meta.url);

async function afterTest() {
  await Promise.all([
    rimrafPromise(path.join(__dirname, '/**/output')),
    rimrafPromise(path.join(__dirname, '/**/output-sharp'))
  ]);
}

export default afterTest;