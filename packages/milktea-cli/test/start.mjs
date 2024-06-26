import childProcess from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { expect } from 'chai';
import afterTest from './afterTest.mjs';
import { metaHelper } from '@sweet-milktea/utils';

const { __dirname } = metaHelper(import.meta.url);
const index = path.join(__dirname, 'dist/index.js');

function run() {
  const cli = path.join(__dirname, '../esm/cli.js');
  const config = path.join(__dirname, './config/sweet.config.js');

  return new Promise((resolve, reject) => {
    const child = childProcess.spawn('node', [cli, 'start', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code) => {
      resolve();
    });

    child.stdout.on('data', (d) => console.log(d.toString()));
    child.stderr.on('data', (d) => console.log(d.toString()));
    child.on('error', (err) => reject(err));

    // 保证文件编译后结束进程
    const timer = setInterval(() => {
      if (fs.existsSync(index)) {
        clearInterval(timer);
        child.kill();
      }
    }, 1000);
  }).catch((err) => {
    console.error(err);
  });
}

describe('args: start', function() {
  it('should index.js file is existing', async function() {
    await run();

    expect(fs.existsSync(index)).to.be.true;
  });

  after(afterTest);
});
