import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';
import image2webp from '../../lib/image2webp';

describe('image2webp', function(): void {
  it('image2webp', async function(): Promise<void> {
    await image2webp(__dirname, __dirname);

    const isExists: boolean = fs.existsSync(path.join(__dirname, 'image.webp'));

    expect(isExists).to.be.true;
  });
});