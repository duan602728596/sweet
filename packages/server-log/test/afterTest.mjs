import util from 'node:util';
import path from 'node:path';
import rimraf from 'rimraf';
import { metaHelper } from '@sweet-milktea/utils';

const rimrafPromise = util.promisify(rimraf);
const { __dirname } = metaHelper(import.meta.url);

async function afterTest() {
  await rimrafPromise(path.join(__dirname, '.sweet'));
}

export default afterTest;