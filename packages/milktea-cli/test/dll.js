import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run(): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    const child: Object = child_process.spawn('node', ['../lib/cli', 'dll'], {
      cwd: __dirname
    });

    child.on('close', (code: string): void=>{
      resolve();
    });
  });
}

describe('args: dll', function(): void{
  it('dll', async function(): Promise<void>{
    await run();
  
    expect(fs.existsSync(path.join(__dirname, '.dll/dll.js'))).to.be.true;
    expect(fs.existsSync(path.join(__dirname, '.dll/manifest.json'))).to.be.true;
  });
});
