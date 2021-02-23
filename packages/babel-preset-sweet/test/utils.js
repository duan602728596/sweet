import { expect } from 'chai';
import { versionCheck, omit } from '../lib/utils';

describe('babel-preset-sweet utils', function() {
  it('versionCheck', function() {
    expect(versionCheck('7.13.0', 13)).to.be.true;
    expect(versionCheck('7.12.14', 13)).to.be.false;
  });

  it('omit', function() {
    expect(
      omit({
        a: 1,
        b: 2,
        c: '3'
      }, ['a'])
    ).to.be.eql({
      b: 2,
      c: '3'
    });
  });
});