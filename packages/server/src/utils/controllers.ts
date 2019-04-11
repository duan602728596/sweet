import * as path from 'path';
import * as glob from 'glob';
import * as _ from 'lodash';

const controllers: string = 'controllers/**/*.js';

/**
 * 将路径转化成Map，key全部转换成小写
 * 小写用来兼容大小写查询，大写用来映射实际的文件
 */
export function pathArrayToMap(pathArr: Array<string>, basicPath: string): Map<string, string> {
  const map: Map<string, string> = new Map();

  return _.transform(pathArr, function(result: Map<string, string>, value: string): void {
    const key: string = value.toLowerCase()
      .replace(/^controllers\//i, '');

    result.set(key, path.join(basicPath, value));
  }, map);
}

/* 获取函数 */
export function getControllersFiles(basicPath: string): Promise<Map<string, string>> {
  return new Promise((resolve: Function, reject: Function): void => {
    glob(controllers, {
      cwd: basicPath
    }, function(err: Error, files: Array<string>): void {
      resolve(pathArrayToMap(files, basicPath));
    });
  });
}

/* 获取函数 */
export function getControllersFilesSync(basicPath: string): Map<string, string> {
  const files: Array<string> = glob.sync(controllers, {
    cwd: basicPath
  });

  return pathArrayToMap(files, basicPath);
}