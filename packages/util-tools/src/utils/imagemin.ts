import type imageMin from 'imagemin';

async function getImageMin(): Promise<typeof imageMin> {
  const imageMinModule: any = await import('imagemin');

  return imageMinModule.default;
}

export default getImageMin;