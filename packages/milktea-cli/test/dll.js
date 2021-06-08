import childProcess from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run() {
  const cli = path.join(__dirname, '../lib/cli');
  const config = path.join(__dirname, './sweet.config.mjs');

  return new Promise((resolve, reject) => {
    const child = childProcess.spawn('node', [cli, 'dll', '--config', config], {
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

describe('args: dll', function() {
  it('should dll.mjs and manifest.json files is existing', async function() {
    await run();

    expect(fs.existsSync(path.join(__dirname, '.sweet/dll/dll.mjs'))).to.be.true;
    expect(fs.existsSync(path.join(__dirname, '.sweet/dll/manifest.json'))).to.be.true;
  });
});
