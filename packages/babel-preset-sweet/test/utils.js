import { expect } from 'chai';
import { versionCheck, omit } from '../lib/utils';

describe('babel-preset-sweet utils', function() {
  it('versionCheck', function() {
    expect(versionCheck('8.0.0', [7, 13])).to.be.true;
    expect(versionCheck('7.13.0', [7, 13])).to.be.true;
    expect(versionCheck('7.12.14', [7, 13])).to.be.false;
    expect(versionCheck('7.5.8', [7, 5, 9])).to.be.false;
  });

  it('omit', function() {
    expect(
      omit({
        name: 'ddd',
        age: 12,
        from: 'from'
      }, ['from'])
    ).to.be.eql({
      name: 'ddd',
      age: 12
    });
  });
});