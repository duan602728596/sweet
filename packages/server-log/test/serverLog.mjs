import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';
import serverLog from '../esm/index.js';
import afterTest from './afterTest.mjs';

const { __dirname } = metaHelper(import.meta.url);
const { accessLogger, logger } = serverLog('file', {
  basicPath: path.join(process.cwd(), 'test')
});

describe('server log', function() {
  it('should has a logs dir', function() {
    logger.error('error');

    expect(fs.existsSync(path.join(__dirname, '.sweet/logs'))).to.be.true;
  });

  after(afterTest);
});