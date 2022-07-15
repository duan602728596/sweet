import * as process from 'node:process';
import _ from 'lodash';

type StandardEntry = {
  [key: string]: Array<string>;
}

type EntryPath = string | string[];

type Entry = {
  [key: string]: EntryPath;
} | EntryPath;

const env: string = process.env.NODE_ENV ?? 'development';

function hotEntry(): Array<string> {
  return [
    '@sweet-milktea/server-hot-client/client',
    'webpack/hot/dev-server'
  ];
}

/* 用于包装hmr的入口 */
function hotClientEntry(entry: Entry): StandardEntry | Entry {
  if (env !== 'development') return entry;

  // string类型
  if (typeof entry === 'string') {
    return { index: hotEntry().concat([entry]) };
  }

  // 数组
  if (Array.isArray(entry)) {
    return { index: hotEntry().concat([...entry]) };
  }

  // object
  if (_.isPlainObject(entry)) {
    const result: StandardEntry = {};

    for (const key in entry) {
      const value: EntryPath = entry[key];

      if (Array.isArray(value)) {
        result[key] = hotEntry().concat([...value]);
      } else {
        result[key] = hotEntry().concat([value]);
      }
    }

    return result;
  }

  return entry;
}

export default hotClientEntry;