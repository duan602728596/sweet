import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const index = path.join(__dirname, 'build/index.js');

function run() {
  const cli = path.join(__dirname, '../lib/cli');
  const config = path.join(__dirname, './sweet.config.js');

  return new Promise((resolve, reject) => {
    const child = child_process.spawn('node', [cli, 'start', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code) => {
      resolve();
    });

    child.stdout.on('data', () => undefined);
    child.stderr.on('data', () => undefined);

    // 保证文件编译后结束进程
    const timer = setInterval(() => {
      if (fs.existsSync(index)) {
        clearInterval(timer);
        child.kill();
      }
    }, 1000);
  });
}

describe('args: start', function() {
  it('should index.js file is existing', async function() {
    await run();

    expect(fs.existsSync(index)).to.be.true;
  });
});
