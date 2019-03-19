import { expect } from 'chai';
import { formatLoader } from '../lib/utils/utils';

describe('function', function() {
  it('should return correct webpack rule', function() {
    expect(formatLoader({
      test: /.*/,
      use: ['babel-loader']
    })).to.be.eql({
      test: /.*/,
      use: [{
        loader: 'babel-loader'
      }]
    });
  });


});