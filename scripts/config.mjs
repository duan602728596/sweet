/* 通用配置 */
import path from 'path';

export const __dirname = path.dirname(
  decodeURIComponent(import.meta.url.replace(/^file:\/{2}/, '')));

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