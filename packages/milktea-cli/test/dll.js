// @flow
import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run(): Promise<void> {
  const cli: string = path.join(__dirname, '../lib/cli');
  const config: string = path.join(__dirname, './.sweetrc.js');

  return new Promise((resolve: Function, reject: Function): void => {
    const child: Object = child_process.spawn('node', [cli, 'dll', '--config', config], {
      cwd: __dirname
    });

    child.on('close', (code: ArrayBuffer): void => {
      resolve();
    });

    child.stdout.on('data', (): void => undefined);
    child.stderr.on('data', (): void => undefined);
  });
}

describe('args: dll', function(): void{
  it('dll', async function(): Promise<void> {
    await run();

    expect(fs.existsSync(path.join(__dirname, '.dll/dll.js'))).to.be.true;
    expect(fs.existsSync(path.join(__dirname, '.dll/manifest.json'))).to.be.true;
  });
});
