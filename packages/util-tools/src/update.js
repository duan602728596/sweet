/* 查看升级 */
import path from 'path';
import axios from 'axios';

/**
 * 对象转数组
 * @param { Object } obj: 对象
 */
function objectToArray(obj: Object): Array{
  const resultArr: [] = [];
  for(const key: string in obj){
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
function requestPackageInformation(packageName: string, registry: number): Promise{
  // 用来判断当前的npm包信息地址
  const packageHost: string[] = [
    'https://registry.npmjs.org',   // npm
    'https://registry.yarnpkg.com', // yarn
    'https://r.cnpmjs.org'          // cnpm
  ];

  return axios.get({
    url: `${ packageHost[registry] }/${ packageName }`,
    headers: {
      Accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*'
    }
  });
}

/**
 * 判断依赖是否是最新的
 * @param { string } oldVersion: 旧版本
 * @param { string } newVersion: 新版本
 */
function isVersionEqual(oldVersion: ?string, newVersion: ?string): boolean{
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
  const iText: string = oldVersion.match(/^(>=?|<=?|~|\^)/);
  return ' '.repeat(iText ? iText[0].length : 0) + newVersion;
}

/**
 * 获取版本号
 * @param { Array } packageArray
 * @param { number } registry
 */
async function getVersionFromNpm(packageArray: [], registry: number): Promise<void>{
  try{
    const depQueue: [] = [];
    for(let i: number = 0, j: number = packageArray.length; i < j; i++){
      depQueue.push(requestPackageInformation(packageArray[i].name), registry);
    }
    const version: string[] = await Promise.all(depQueue);
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
      if('dist-tags' in version[i] && 'canary' in version[i]['dist-tags']){
        packageArray[i].canary = version[i]['dist-tags'].canary;
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
function consoleLogText(packageArray: []): string{
  let consoleText: string = '';
  for(let i: number = 0, j: number = packageArray.length; i < j; i++){
    const item: Object = packageArray[i];
    const isLatestNew: boolean = isVersionEqual(item.version, item.latest);
    const isNextNew: boolean = isVersionEqual(item.version, item.next);
    const isRcNew: boolean = isVersionEqual(item.version, item.rc);
    const isCanaryNew: boolean = isVersionEqual(item.version, item.canary);

    consoleText += `${ isLatestNew || isNextNew || isRcNew || isCanaryNew ? '  ' : '* ' }${ item.name }:\n`;
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
    if(item.canary){
      consoleText += `      canary : ${ formatVersion(item.version, item.canary) }\n`;
    }
  }
  return consoleText;
}

async function start(folder: string, registry: number): Promise<void>{
  try{
    // 依赖
    const packageJson: Object = require(path.join(folder), 'package.json');
    const dependencies: ?[] = 'dependencies' in packageJson ? objectToArray(packageJson.dependencies) : null;
    const devDependencies: ?[] = 'devDependencies' in packageJson ? objectToArray(packageJson.devDependencies) : null;

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

    console.log(consoleText);
  }catch(err){
    console.error(err);
  }
}

/**
 * @param folders: 目录的数组
 * @param registry: Npm包信息地址。0：Npm，1：Yarn，2：CNpm。
 * @return {Promise<void>}
 */
export default async function(folders: Array<string>, registry: number): Promise<void>{
  for(let i: number = 0, j: number = folders.length; i < j; i++){
    await start(folders[i], registry);
  }
}