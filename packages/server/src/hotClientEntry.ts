import * as process from 'process';
import * as querystring from 'querystring';
import * as _ from 'lodash';
import { webpackHmrPath } from './utils/utils';

type StandardEntry = {
  [key: string]: Array<string>;
}

type EntryPath = string | string[];

type Entry = {
  [key: string]: EntryPath;
} | EntryPath;

const env: string = process.env.NODE_ENV ?? 'development';

function hotEntry(name: string): string {
  const query: string = querystring.stringify({
    path: webpackHmrPath,
    name,
    noInfo: true
  });

  return `webpack-hot-middleware/client?${ query }`;
}

/* 用于包装hmr的入口 */
function hotClientEntry(entry: Entry): StandardEntry | Entry {
  if (env !== 'development') return entry;

  // string类型
  if (typeof entry === 'string') {
    return { index: [hotEntry('index'), entry] };
  }

  // 数组
  if (Array.isArray(entry)) {
    return { index: [hotEntry('index'), ...entry] };
  }

  // object
  if (_.isPlainObject(entry)) {
    const result: StandardEntry = {};

    for (const key in entry) {
      const value: EntryPath = entry[key];

      if (Array.isArray(value)) {
        result[key] = [hotEntry(key), ...value];
      } else {
        result[key] = [hotEntry(key), value];
      }
    }

    return result;
  }

  return entry;
}

export default hotClientEntry;