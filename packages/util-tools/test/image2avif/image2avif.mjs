import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import image2avif from '../../esm/image2avif.js';

const { __dirname } = metaHelper(import.meta.url);

describe('image2avif', function() {
  it('should has avif picture files, conversion used avifenc', async function() {
    await image2avif(path.join(__dirname, 'image'), path.join(__dirname, 'output'), 'avifenc', true);

    const isExists = fs.existsSync(path.join(__dirname, 'output/image.avif'));

    expect(isExists).to.be.true;
  });

  it('should has avif picture files, conversion used sharp', async function() {
    await image2avif(path.join(__dirname, 'image-sharp'), path.join(__dirname, 'output-sharp'), 'sharp', true);

    const isExists = fs.existsSync(path.join(__dirname, 'output-sharp/image.avif'));

    expect(isExists).to.be.true;
  });
});