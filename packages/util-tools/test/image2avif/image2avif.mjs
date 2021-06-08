import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import image2avif from '../../image2avif.js';

const { __dirname } = metaHelper(import.meta.url);

describe('image2avif', function() {
  it('should has avif picture files', async function() {
    await image2avif(path.join(__dirname, 'image'), path.join(__dirname, 'output'), true);

    const isExists = fs.existsSync(path.join(__dirname, 'output/image.avif'));

    expect(isExists).to.be.true;
  });
});