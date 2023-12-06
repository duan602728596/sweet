import path from 'node:path';
import { rimraf } from 'rimraf';
import { metaHelper } from '@sweet-milktea/utils';

const { __dirname } = metaHelper(import.meta.url);

async function afterTest() {
  await Promise.all([
    rimraf(path.join(__dirname, '../.sweet')),
    rimraf(path.join(__dirname, 'dist'))
  ]);
}

export default afterTest;