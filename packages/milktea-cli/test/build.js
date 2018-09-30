import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

function run(): Promise{
  return new Promise((resolve: Function, reject: Function): void=>{
    const child: Object = child_process.spawn('node', ['../lib/cli', 'build'], {
      cwd: __dirname,
      env: {
        NODE_ENV: 'production'
      }
    });

    child.on('close', (code: string): void=>{
      resolve();
    });
  });
}

describe('args: build', function(): void{
  it('build', async function(): Promise<void>{
    await run();
  
    expect(fs.existsSync(path.join(__dirname, 'build/app.build.js'))).to.be.true;
  });
});
