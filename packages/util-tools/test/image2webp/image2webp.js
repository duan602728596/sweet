import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import image2webp from '../../image2webp';

describe('image2webp', function() {
  it('should has a webp picture file', async function() {
    await image2webp(path.join(__dirname, 'image'), path.join(__dirname, 'output'));

    const isJpegExists = fs.existsSync(path.join(__dirname, 'output/image.webp'));

    expect(isJpegExists).to.be.true;
  });
});