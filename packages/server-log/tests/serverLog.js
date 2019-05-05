import process from 'process';
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import serverLog from '../lib/index';

const { accessLogger, applicationLogger } = serverLog('file', {
  basicPath: path.join(process.cwd(), 'tests')
});

describe('server log', function() {
  it('should has a .logs dir', function() {
    applicationLogger.error('error');

    expect(fs.existsSync(path.join(__dirname, '.logs'))).to.be.true;
  });
});