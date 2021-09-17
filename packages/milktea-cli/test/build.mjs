import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';

const { __dirname } = metaHelper(import.meta.url);

function run() {
  const cli = path.join(__dirname, '../lib/cli');
  const config = path.join(__dirname, './sweet.config.build.ts');

  return new Promise((resolve, reject) => {
    const child = childProcess.spawn('node', [cli, 'build', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code) => {
      resolve();
    });

    child.stdout.on('data', () => undefined);
    child.stderr.on('data', () => undefined);
    child.on('error', (err) => reject(err));
  }).catch((err) => {
    console.error(err);
  });
}

describe('args: build', function() {
  it('should index.build.js is existing', async function() {
    await run();

    expect(fs.existsSync(path.join(__dirname, 'dist/index.build.js'))).to.be.true;
  });
});
