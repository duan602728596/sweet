/* 查看升级 */
import * as path from 'path';
import axios, { AxiosResponse } from 'axios';
import * as _ from 'lodash';

interface DistTags {
  latest?: string;
  next?: string;
  rc?: string;
}

interface PackageInformation {
  error?: string;
  'dist-tags'?: DistTags;
}

interface PackageItem {
  name: string;
  version: string;
  latest?: string;
  next?: string;
  rc?: string;
}

/**
 * 对象转数组
 * @param { object } obj: 对象
 */
function objectToArray(obj: object): Array<PackageItem> {
  return _.transform(obj, function(result: Array<PackageItem>, value: string, key: string): void {
    result.push({
      name: key, // 包的名称
      version: obj[key] // 包的当前版本号
    });
  }, []);
}

/**
 * 查找包
 * @param { string } packageName: npm包名
 * @param { number } registry
 */
async function requestPackageInformation(packageName: string, registry: number): Promise<PackageInformation> {
  // 用来判断当前的npm包信息地址
  const packageHost: string[] = [
    'https://registry.npmjs.org', // npm
    'https://registry.yarnpkg.com', // yarn
    'https://r.cnpmjs.org' // cnpm
  ];

  const res: AxiosResponse = await axios({
    method: 'GET',
    url: `${ packageHost[registry] }/${ packageName }`,
    headers: {
      Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
    },
    validateStatus: (): boolean => true
  });

  return res.data;
}

/**
 * 判断依赖是否是最新的
 * @param { string } oldVersion: 旧版本
 * @param { string } newVersion: 新版本
 */
function isVersionEqual(oldVersion: string, newVersion: string | undefined): boolean {
  if (!newVersion) {
    return false;
  } else if (/^(>=?|<=?|~|\^).*$/.test(oldVersion)) {
    // 判断前面是否有特殊符号，比如>、>=、<、<=、~、^
    return oldVersion.replace(/(>=?|<=?|~|\^)/g, '') === newVersion;
  } else {
    return oldVersion === newVersion;
  }
}

/**
 * 格式化输出的版本号
 * @param { string } oldVersion: 旧版本
 * @param { string } newVersion: 新版本
 */
function formatVersion(oldVersion: string, newVersion: string): string {
  const iText: Array<string> | null = oldVersion.match(/^(>=?|<=?|~|\^)/);

  return ' '.repeat(iText ? iText[0].length : 0) + newVersion;
}

/**
 * 获取版本号
 * @param { Array<PackageItem> } packageArray
 * @param { number } registry
 */
async function getVersionFromNpm(packageArray: Array<PackageItem>, registry: number): Promise<void> {
  try {
    const depQueue: Promise<PackageInformation>[] = _.transform(packageArray, function(result: Promise<PackageInformation>[], value: PackageItem): void {
      result.push(requestPackageInformation(value.name, registry));
    }, []);

    const version: Array<PackageInformation> = await Promise.all(depQueue);

    for (let i: number = 0, j: number = packageArray.length; i < j; i++) {
      const packageItem: PackageItem = packageArray[i];
      const versionItem: PackageInformation = version[i];

      if (versionItem['dist-tags']) {
        const distTags: DistTags = versionItem['dist-tags'];

        if (distTags.latest) {
          packageItem.latest = distTags.latest;
        }

        if (distTags.next) {
          packageItem.next = distTags.next;
        }

        if (distTags.rc) {
          packageItem.rc = distTags.rc;
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * 输出console.log文本
 * @param { Array<PackageItem> } packageArray
 */
function consoleLogText(packageArray: Array<PackageItem>): string {
  let consoleText: string = '';

  for (const item of packageArray) {
    const isLatestNew: boolean = isVersionEqual(item.version, item.latest);
    const isNextNew: boolean = isVersionEqual(item.version, item.next);
    const isRcNew: boolean = isVersionEqual(item.version, item.rc);

    // 包需要升级，使用“*”；包在npm上不存在（私有包），使用“#”
    const symbol: string = (item.latest || item.next || item.rc) ? '*' : '#';

    consoleText += `  ${ isLatestNew || isNextNew || isRcNew ? ' ' : symbol } ${ item.name }:\n`;
    consoleText += `      version: ${ item.version }\n`;

    if (item.latest) {
      consoleText += `      latest : ${ formatVersion(item.version, item.latest) }\n`;
    }

    if (item.next) {
      consoleText += `      next   : ${ formatVersion(item.version, item.next) }\n`;
    }

    if (item.rc) {
      consoleText += `      rc     : ${ formatVersion(item.version, item.rc) }\n`;
    }
  }

  return consoleText;
}

async function start(folder: string, registry: number, test: boolean): Promise<void> {
  try {
    // 依赖
    const packageJson: { dependencies: object; devDependencies: object } = require(path.join(folder, 'package.json'));
    const dependencies: Array<PackageItem> | null = 'dependencies' in packageJson
      ? objectToArray(packageJson.dependencies)
      : null;
    const devDependencies: Array<PackageItem> | null = 'devDependencies' in packageJson
      ? objectToArray(packageJson.devDependencies)
      : null;

    // 获取dep和dev的最新版本号
    if (dependencies) {
      await getVersionFromNpm(dependencies, registry);
    }

    if (devDependencies) {
      await getVersionFromNpm(devDependencies, registry);
    }

    // 输出
    let consoleText: string = `${ folder }:\n`;

    if (dependencies) {
      consoleText += '  dependencies:\n';
      consoleText += consoleLogText(dependencies);
    }

    if (devDependencies) {
      consoleText += '  devDependencies:\n';
      consoleText += consoleLogText(devDependencies);
    }

    if (!test) {
      console.log(consoleText);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param { Array<string> } folders: 目录的数组
 * @param { number } registry: Npm包信息地址。0：Npm，1：Yarn，2：CNpm。
 * @param { boolean } test: 是否为测试环境
 */
export default async function(folders: Array<string>, registry: number, test: boolean): Promise<void> {
  for (const folder of folders) {
    await start(folder, registry, test);
  }
}