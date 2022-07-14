import * as fs from 'node:fs';
import fse from 'fs-extra';
import { Icns, IcnsImage, type OSType } from '@fiahfy/icns';

/* 解析osType */
const oneK: { [key: string]: OSType } = {
  '16': 'ic04',
  '32': 'ic05',
  '128': 'ic07',
  '256': 'ic08',
  '512': 'ic09',
  '1024': 'ic10'
};

const twoK: { [key: string]: OSType } = {
  '512': 'ic10',
  '16': 'ic11',
  '32': 'ic12',
  '128': 'ic13',
  '256': 'ic14'
};

function getOsType(size: number, retina: number): OSType {
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
  const osType: OSType = getOsType(size, retina);

  // 生成图标
  const imageData: Buffer = await fs.promises.readFile(entry);
  const image: IcnsImage = await IcnsImage.fromPNG(imageData, osType);

  icns.append(image);
  await fse.outputFile(output, icns.data);
}

export default image2icns;