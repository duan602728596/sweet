function isPlainObject<T = any>(entry: T): boolean {
  return typeof entry === 'object' && Object.prototype.toString.call(entry) === '[object Object]';
}

type StandardEntry = {
  [key: string]: Array<string>;
}

type EntryPath = string | string[];

type Entry = {
  [key: string]: EntryPath;
} | EntryPath;

const env: string = process.env.NODE_ENV ?? 'development';

function hotEntry(name: string): Array<string> {
  return [
    `webpack-hot-middleware/client?hot=true&name=${ name }`,
    'webpack/hot/dev-server'
  ];
}

/* 用于包装hmr的入口 */
function hotClientEntry(entry: Entry): StandardEntry | Entry {
  if (env !== 'development') return entry;

  // string类型
  if (typeof entry === 'string') {
    return { index: hotEntry('index').concat([entry]) };
  }

  // 数组
  if (Array.isArray(entry)) {
    return { index: hotEntry('index').concat([...entry]) };
  }

  // object
  if (isPlainObject(entry)) {
    const result: StandardEntry = {};

    for (const key in entry) {
      const value: EntryPath = entry[key];

      if (Array.isArray(value)) {
        result[key] = hotEntry(key).concat([...value]);
      } else {
        result[key] = hotEntry(key).concat([value]);
      }
    }

    return result;
  }

  return entry;
}

export default hotClientEntry;