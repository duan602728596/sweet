import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run() {
  const cli = path.join(__dirname, '../lib/cli');
  const config = path.join(__dirname, './sweet.config.js');

  return new Promise((resolve, reject) => {
    const child = child_process.spawn('node', [cli, 'dll', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code) => {
      resolve();
    });

    child.stdout.on('data', () => undefined);
    child.stderr.on('data', () => undefined);
  });
}

describe('args: dll', function() {
  it('should dll.js and manifest.json files is existing', async function() {
    await run();

    expect(fs.existsSync(path.join(__dirname, '.dll/dll.js'))).to.be.true;
    expect(fs.existsSync(path.join(__dirname, '.dll/manifest.json'))).to.be.true;
  });
});
