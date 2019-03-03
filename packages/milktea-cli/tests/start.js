import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

const index: string = path.join(__dirname, 'build/index.js');

function run(): Promise<void> {
  const cli: string = path.join(__dirname, '../lib/cli');
  const config: string = path.join(__dirname, './sweet.config.js');

  return new Promise((resolve: Function, reject: Function): void => {
    const child: child_process.ChildProcess = child_process.spawn('node', [cli, 'start', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code: ArrayBuffer): void => {
      resolve();
    });

    child.stdout.on('data', (): void => undefined);
    child.stderr.on('data', (): void => undefined);

    // 保证文件编译后结束进程
    const timer: number = setInterval((): void => {
      if (fs.existsSync(index)) {
        clearInterval(timer);
        child.kill();
      }
    }, 1000);
  });
}

describe('args: start', function(): void {
  it('should index.js file is existing', async function(): Promise<void> {
    await run();

    expect(fs.existsSync(index)).to.be.true;
  });
});
