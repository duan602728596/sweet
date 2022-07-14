import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import image2webp from '../../esm/image2webp.js';

const { __dirname } = metaHelper(import.meta.url);

describe('image2webp', function() {
  it('should has a webp picture file', async function() {
    await image2webp(path.join(__dirname, 'image'), path.join(__dirname, 'output'));

    const isJpegExists = fs.existsSync(path.join(__dirname, 'output/image.webp'));
    const isGifExists = fs.existsSync(path.join(__dirname, 'output/image-gif.webp'));

    expect(isJpegExists).to.be.true;
    expect(isGifExists).to.be.true;
  });
});