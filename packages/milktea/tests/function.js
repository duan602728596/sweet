import { expect } from 'chai';
import { formatLoader } from '../lib/utils/utils';

describe('function', function() {
  it('should return correct webpack rule', function() {
    const before = {
      test: /.*/,
      use: ['babel-loader']
    };

    const after = {
      test: /.*/,
      use: [{
        loader: 'babel-loader'
      }]
    };

    expect(formatLoader(before)).to.be.eql(after);
  });

  it('should return correct webpack rule', function() {
    const before = {
      test: /.*/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            babelrc: false
          }
        }
      ]
    };

    expect(formatLoader(before)).to.be.eql(before);
  });
});