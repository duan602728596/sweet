import * as fs from 'fs';
import * as fse from 'fs-extra';
import * as Icns from '@fiahfy/icns';

/**
 * 读取文件
 * @param { string } entry: 入口文件夹
 */
function readFile(entry: string): Promise<Buffer> {
  return new Promise((resolve: Function, reject: Function): void => {
    fs.readFile(entry, (err: Error, data: Buffer): void => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

/* 解析osType */
const oneK: { [key: string]: string } = {
  '16': 'ic04',
  '32': 'ic05',
  '128': 'ic07',
  '256': 'ic08',
  '512': 'ic09',
  '1024': 'ic10'
};

const twoK: { [key: string]: string } = {
  '512': 'ic10',
  '16': 'ic11',
  '32': 'ic12',
  '128': 'ic13',
  '256': 'ic14'
};

function getOsType(size: number, retina: number): string {
  const sizeStr: string = String(size);

  if (retina === 2 && (sizeStr in twoK)) {
    return twoK[sizeStr];
  } else if (retina === 1 && (sizeStr in oneK)) {
    return oneK[sizeStr];
  } else {
    return oneK['1024'];
  }
}

interface Options {
  size?: number;
  retina?: number;
}

/**
 * 生成icns图标
 * @param { string } entry: 图片文件
 * @param { string } output: 输出文件
 * @param { Options } options: 配置
 */
async function image2icns(entry: string, output: string, options: Options = {}): Promise<void> {
  const {
    size = 1024,
    retina = 1
  }: Options = options;
  const icns: Icns = new Icns();
  const osType: string = getOsType(size, retina);

  // 生成图标
  const imageData: Buffer = await readFile(entry);

  await icns.appendImage(imageData, osType);
  await fse.outputFile(output, icns.data);
}

export default image2icns;