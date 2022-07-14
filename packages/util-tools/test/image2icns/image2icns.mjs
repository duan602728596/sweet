import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils/index.cjs';
import image2icns from '../../esm/image2icns.js';

const { __dirname } = metaHelper(import.meta.url);

describe('image2icns', function() {
  it('should has a icns picture file', async function() {
    const icnsFile = path.join(__dirname, 'output/256x256.icns');

    await image2icns(
      path.join(__dirname, 'image/256x256.png'),
      icnsFile,
      { size: 256, retina: 1 }
    );

    const isExists = fs.existsSync(icnsFile);

    expect(isExists).to.be.true;
  });
});