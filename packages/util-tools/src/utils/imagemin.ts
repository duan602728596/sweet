import importESM from '@sweet-milktea/utils/importESM';
import type imageMin from 'imagemin';

// TODO: https://github.com/microsoft/TypeScript/issues/43329
async function getImageMin(): Promise<typeof imageMin> {
  const imageMinModule: any = await importESM('imagemin');

  return imageMinModule.default;
}

export default getImageMin;