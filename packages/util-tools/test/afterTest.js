import util from 'util';
import path from 'path';
import rimraf from 'rimraf';

const rimrafPromise = util.promisify(rimraf);

async function afterTest() {
  await Promise.all([
    rimrafPromise(path.join(__dirname, 'image2webp/**/*.webp')),
    rimrafPromise(path.join(__dirname, 'imageCompress/output')),
    rimrafPromise(path.join(__dirname, 'image2icns/**/*.icns')),
    rimrafPromise(path.join(__dirname, 'media2webp/output'))
  ]);
}

export default afterTest;