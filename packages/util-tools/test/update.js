// @flow
import path from 'path';
import { expect } from 'chai';
import update from '../lib/update';

describe('update', function(): void {
  it('update', async function(): Promise<void> {
    let isErr: boolean = false;

    try {
      await update([path.join(__dirname, '..')], 2, true);
    } catch (err) {
      isErr = true;
    }

    expect(isErr).to.be.false;
  });
});