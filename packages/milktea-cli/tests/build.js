import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { expect } from 'chai';

function run(): Promise<void> {
  const cli: string = path.join(__dirname, '../lib/cli');
  const config: string = path.join(__dirname, './sweet.config.build.js');

  return new Promise((resolve: Function, reject: Function): void => {
    const child: object = child_process.spawn('node', [cli, 'build', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code: ArrayBuffer): void => {
      resolve();
    });

    child.stdout.on('data', (): void => undefined);
    child.stderr.on('data', (): void => undefined);
  });
}

describe('args: build', function(): void {
  it('should index.build.js is existing', async function(): Promise<void> {
    await run();

    expect(fs.existsSync(path.join(__dirname, 'build/index.build.js'))).to.be.true;
  });
});
