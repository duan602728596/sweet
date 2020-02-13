import path from 'path';

export default {
  parser: path.join(__dirname, '../../../node_modules/@typescript-eslint/parser/dist/parser'),
  tsconfig: path.join(__dirname, '../../../tsconfig.json')
};