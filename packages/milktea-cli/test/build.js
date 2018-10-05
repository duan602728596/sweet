import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run(): Promise{
  const cli: string = path.join(__dirname, '../lib/cli');

  return new Promise((resolve: Function, reject: Function): void=>{
    const child: Object = child_process.spawn('node', [cli, 'build'], {
      cwd: __dirname,
      env: {
        NODE_ENV: 'production'
      }
    });

    child.on('close', (code: ArrayBuffer): void=>{
      resolve();
    });

    child.stderr.on('data', (code: ArrayBuffer): void=>{
      console.error(code.toString());
    });

    child.on('error', (error: Error): void=>{
      console.error(error);
    });
  });
}

describe('args: build', function(): void{
  it('build', async function(): Promise<void>{
    await run();
  
    expect(fs.existsSync(path.join(__dirname, 'build/app.build.js'))).to.be.true;
  });
});
