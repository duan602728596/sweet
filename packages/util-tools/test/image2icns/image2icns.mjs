import fs from 'fs';
import path from 'path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import image2icns from '../../image2icns.js';

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