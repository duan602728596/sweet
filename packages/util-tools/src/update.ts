/* 查看升级 */
import * as path from 'path';
import axios, { AxiosResponse } from 'axios';

/**
 * 对象转数组
 * @param { Object } obj: 对象
 */
function objectToArray(obj: object): Array<any>{
  const resultArr: Array<{ name: string, version: string }> = [];

  for(const key in obj){
    resultArr.push({
      name: key,         // 包的名称
      version: obj[key]  // 包的当前版本号
    });
  }
  return resultArr;
}

/**
 * 查找包
 * @param { string } packageName: npm包名
 * @param { number } registry
 */
function requestPackageInformation(packageName: string, registry: number): Promise<any>{
  // 用来判断当前的npm包信息地址
  const packageHost: string[] = [
    'https://registry.npmjs.org',   // npm
    'https://registry.yarnpkg.com', // yarn
    'https://r.cnpmjs.org'          // cnpm
  ];

  return axios({
    method: 'GET',
    url: `${ packageHost[registry] }/${ packageName }`,
    headers: {
      Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
    },
    validateStatus: (): boolean => true
  }).then((res: AxiosResponse): string => res.data);
}

/**
 * 判断依赖是否是最新的
 * @param { string } oldVersion: 旧版本
 * @param { string } newVersion: 新版本
 */
function isVersionEqual(oldVersion: string, newVersion: string): boolean{
  if(newVersion === null || newVersion === undefined){
    return false;
  }else if(/^(>=?|<=?|~|\^).*$/.test(oldVersion)){
    // 判断前面是否有特殊符号，比如>、>=、<、<=、~、^
    return oldVersion.replace(/(>=?|<=?|~|\^)/g, '') === newVersion;
  }else{
    return oldVersion === newVersion;
  }
}

/**
 * 格式化输出的版本号
 * @param { string } oldVersion: 旧版本
 * @param { string } newVersion: 新版本
 */
function formatVersion(oldVersion: string, newVersion: string): string{
  const iText: Array<string> = oldVersion.match(/^(>=?|<=?|~|\^)/);
  return ' '.repeat(iText ? iText[0].length : 0) + newVersion;
}

/**
 * 获取版本号
 * @param { Array } packageArray
 * @param { number } registry
 */
interface PackageArrayItem{
  version: string;
  name: string;
  latest: string;
  next: string;
  rc: string;
  canary: string;
}

async function getVersionFromNpm(packageArray: Array<PackageArrayItem>, registry: number): Promise<void>{
  try{
    const depQueue: Promise<object>[] = [];

    for(let i: number = 0, j: number = packageArray.length; i < j; i++){
      depQueue.push(requestPackageInformation(packageArray[i].name, registry));
    }

    const version: Array<any> = await Promise.all(depQueue);

    for(let i: number = 0, j: number = packageArray.length; i < j; i++){
      if('dist-tags' in version[i] && 'latest' in version[i]['dist-tags']){
        packageArray[i].latest = version[i]['dist-tags'].latest;
      }
      if('dist-tags' in version[i] && 'next' in version[i]['dist-tags']){
        packageArray[i].next = version[i]['dist-tags'].next;
      }
      if('dist-tags' in version[i] && 'rc' in version[i]['dist-tags']){
        packageArray[i].rc = version[i]['dist-tags'].rc;
      }
    }
  }catch(err){
    console.error(err);
  }
}

/**
 * 输出console.log文本
 * @param { Array } packageArray
 */
function consoleLogText(packageArray: Array<any>): string{
  let consoleText: string = '';
  for(let i: number = 0, j: number = packageArray.length; i < j; i++){
    const item: PackageArrayItem = packageArray[i];
    const isLatestNew: boolean = isVersionEqual(item.version, item.latest);
    const isNextNew: boolean = isVersionEqual(item.version, item.next);
    const isRcNew: boolean = isVersionEqual(item.version, item.rc);
    const isCanaryNew: boolean = isVersionEqual(item.version, item.canary);

    consoleText += `  ${ isLatestNew || isNextNew || isRcNew || isCanaryNew ? '  ' : '* ' }${ item.name }:\n`;
    consoleText += `      version: ${ item.version }\n`;

    if(item.latest){
      consoleText += `      latest : ${ formatVersion(item.version, item.latest) }\n`;
    }
    if(item.next){
      consoleText += `      next   : ${ formatVersion(item.version, item.next) }\n`;
    }
    if(item.rc){
      consoleText += `      rc     : ${ formatVersion(item.version, item.rc) }\n`;
    }
  }
  return consoleText;
}

async function start(folder: string, registry: number, test: boolean): Promise<void>{
  try{
    // 依赖
    const packageJson: { dependencies: object, devDependencies: object } = require(path.join(folder, 'package.json'));
    const dependencies: Array<any> = 'dependencies' in packageJson ? objectToArray(packageJson.dependencies) : null;
    const devDependencies: Array<any> = 'devDependencies' in packageJson ? objectToArray(packageJson.devDependencies) : null;

    // 获取dep和dev的最新版本号
    if(dependencies){
      await getVersionFromNpm(dependencies, registry);
    }

    if(devDependencies){
      await getVersionFromNpm(devDependencies, registry);
    }

    // 输出
    let consoleText: string = `${ folder }:\n`;

    if(dependencies){
      consoleText += '  dependencies:\n';
      consoleText += consoleLogText(dependencies);
    }

    if(devDependencies){
      consoleText += '  devDependencies:\n';
      consoleText += consoleLogText(devDependencies);
    }

    if(test !== true){
      console.log(consoleText);
    }
  }catch(err){
    console.error(err);
  }
}

/**
 * @param folders: 目录的数组
 * @param registry: Npm包信息地址。0：Npm，1：Yarn，2：CNpm。
 * @param test: 是否为测试环境
 */
export default async function(folders: Array<string>, registry: number, test: boolean): Promise<void>{
  for(let i: number = 0, j: number = folders.length; i < j; i++){
    await start(folders[i], registry, test);
  }
}