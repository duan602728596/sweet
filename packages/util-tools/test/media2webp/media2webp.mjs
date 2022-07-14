import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import media2webp from '../../esm/media2webp.js';
import afterTest from '../afterTest.mjs';

const { __dirname } = metaHelper(import.meta.url);

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

  after(afterTest);
});