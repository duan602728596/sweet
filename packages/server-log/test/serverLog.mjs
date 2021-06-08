import process from 'process';
import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import serverLog from '../lib/index.js';
import afterTest from './afterTest.mjs';

const { __dirname } = metaHelper(import.meta.url);
const { accessLogger, logger } = serverLog.default('file', {
  basicPath: path.join(process.cwd(), 'test')
});

describe('server log', function() {
  it('should has a logs dir', function() {
    logger.error('error');

    expect(fs.existsSync(path.join(__dirname, '.sweet/logs'))).to.be.true;
  });

  after(afterTest);
});