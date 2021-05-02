import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

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
  it('should index.build.mjs is existing', async function() {
    await run();

    expect(fs.existsSync(path.join(__dirname, 'dist/index.build.mjs'))).to.be.true;
  });
});
