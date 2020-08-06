import path from 'path';
import { expect } from 'chai';
import update from '../../update';

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