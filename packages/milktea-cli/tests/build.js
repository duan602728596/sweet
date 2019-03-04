import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run() {
  const cli = path.join(__dirname, '../lib/cli');
  const config = path.join(__dirname, './sweet.config.build.js');

  return new Promise((resolve, reject) => {
    const child = child_process.spawn('node', [cli, 'build', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code) => {
      resolve();
    });

    child.stdout.on('data', () => undefined);
    child.stderr.on('data', () => undefined);
  });
}

describe('args: build', function() {
  it('should index.build.js is existing', async function() {
    await run();

    expect(fs.existsSync(path.join(__dirname, 'build/index.build.js'))).to.be.true;
  });
});
