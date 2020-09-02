import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import image2avif from '../../image2avif';

describe('image2avif', function() {
  it('should has avif picture files', async function() {
    await image2avif(path.join(__dirname, 'image'), path.join(__dirname, 'output'), true);

    const isExists = fs.existsSync(path.join(__dirname, 'output/image.avif'));

    expect(isExists).to.be.true;
  });
});