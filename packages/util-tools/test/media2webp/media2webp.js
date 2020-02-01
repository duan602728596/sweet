import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import media2webp from '../../media2webp';

describe('media2webp', function() {
  it('should has webp picture files', async function() {
    await media2webp(path.join(__dirname, 'media'), path.join(__dirname, 'output'), true);

    const isExists = fs.existsSync(path.join(__dirname, 'output/image.webp'));
    const isGifExists = fs.existsSync(path.join(__dirname, 'output/image-gif.webp'));
    const isVideoExists = fs.existsSync(path.join(__dirname, 'output/video.webp'));

    expect(isExists).to.be.true;
    expect(isGifExists).to.be.true;
    expect(isVideoExists).to.be.true;
  });
});