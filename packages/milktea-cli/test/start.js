import child_process from 'child_process';
import fs from 'fs';
import path from 'path';
import { expect } from 'chai';

const app: string = path.join(__dirname, 'build/app.js');

function run(): Promise{
  const cli: string = path.join(__dirname, '../lib/cli');

  return new Promise((resolve: Function, reject: Function): void=>{
    const child: Object = child_process.spawn('node', [cli, 'start'], {
      cwd: __dirname,
      env: {
        NODE_ENV: 'development'
      }
    });

    child.on('close', (code: ArrayBuffer): void=>{
      resolve();
    });

    // 保证文件编译后结束进程
    const timer: number = setInterval((): void=>{
      if(fs.existsSync(app)){
        clearInterval(timer);
        child.kill();
      }
    }, 1000);
  });
}

describe('args: start', function(): void{
  it('start', async function(): Promise<void>{
    await run();
  
    expect(fs.existsSync(app)).to.be.true;
  });
});
