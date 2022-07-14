import path from 'node:path';
import { metaHelper } from '@sweet-milktea/utils/index.cjs';

const { __dirname } = metaHelper(import.meta.url);

export default {
  parser: path.join(__dirname, '../../../node_modules/@typescript-eslint/parser/dist/parser'),
  tsconfig: path.join(__dirname, '../../../tsconfig.json')
};