import { requireModule } from './utils';

/* TODO: 判断webpack版本是否大于webpack@5.0.0-beta.30版本 */
function isWebpack5Beta30(): boolean {
  const { version }: { version: string } = requireModule('webpack/package.json');
  const versionArr: Array<string> = version.split(/-/);

  if (versionArr[1] && /beta\.[0-9]+/.test(versionArr[1])) {
    const versionNumber: number = Number(versionArr[1].replace(/^beta\./, ''));

    return versionNumber >= 30;
  } else {
    return true;
  }
}

export default isWebpack5Beta30();