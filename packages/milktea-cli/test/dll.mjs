import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import { metaHelper } from '@sweet-milktea/utils';

const { __dirname } = metaHelper(import.meta.url);

function run() {
  const cli = path.join(__dirname, '../esm/cli.js');
  const config = path.join(__dirname, './config/sweet.config.js');

  return new Promise((resolve, reject) => {
    const child = childProcess.spawn('node', [cli, 'dll', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code) => {
      resolve();
    });

    child.stdout.on('data', (d) => console.log(d.toString()));
    child.stderr.on('data', (d) => console.log(d.toString()));
    child.on('error', (err) => reject(err));
  }).catch((err) => {
    console.error(err);
  });
}

describe('args: dll', function() {
  it('should dll.mjs and manifest.json files is existing', async function() {
    await run();

    expect(fs.existsSync(path.join(__dirname, '.sweet/dll/dll.js'))).to.be.true;
    expect(fs.existsSync(path.join(__dirname, '.sweet/dll/manifest.json'))).to.be.true;
  });
});
