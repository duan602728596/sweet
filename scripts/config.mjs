/* 通用配置 */
import path from 'path';
import { fileURLToPath } from 'url';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export const dir = path.join(__dirname, '../packages');

export const packageNames = [
  'milktea',
  'milktea-cli',
  'milktea-vite',
  'server',
  'server-log',
  'util-tools',
  'utils',
  'eslint-plugin',
  'babel-preset-sweet'
];