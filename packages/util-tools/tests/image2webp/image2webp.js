import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import image2webp from '../../lib/image2webp';

describe('image2webp', function() {
  it('should has a webp picture file', async function() {
    await image2webp(__dirname, __dirname);

    const isExists = fs.existsSync(path.join(__dirname, 'image.webp'));

    expect(isExists).to.be.true;
  });
});