import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import update from '../../update.js';

const { __dirname } = metaHelper(import.meta.url);

describe('update', function() {
  it('update', async function() {
    let isErr = false;

    try {
      await update([path.join(__dirname, '../..')], 2, false, true);
    } catch (err) {
      isErr = true;
    }

    expect(isErr).to.be.false;
  });
});