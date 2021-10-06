import type imageMin from 'imagemin';

async function getImageMin(): Promise<typeof imageMin> {
  const imageMinModule: { default: typeof imageMin } = await import('imagemin');

  return imageMinModule.default;
}

export default getImageMin;