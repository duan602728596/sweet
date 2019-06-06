import process from 'process';
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import serverLog from '../lib/index';

const { accessLogger, logger } = serverLog('file', {
  basicPath: path.join(process.cwd(), 'tests')
});

describe('server log', function() {
  it('should has a logs dir', function() {
    logger.error('error');

    expect(fs.existsSync(path.join(__dirname, '.sweet/logs'))).to.be.true;
  });
});