import { promisify } from 'util';
import { transform } from '@babel/core';
import { expect } from 'chai';

const transformPromise = promisify(transform);

/* 编译代码 */
function transformCode(code, options) {
  return transformPromise(code, {
    presets: [
      [require('../cjs'), options]
    ]
  });
}

describe('babel-preset-sweet', function() {
  it('build javascript', async function() {
    const { code } = await transformCode(`const a = 5;
    const b = <div />;
    const c = {};
    const d = c?.e;`);

    console.log(code);

    expect(code.includes('var a = 5;')).to.be.true;
    expect(code.includes('jsx')).to.be.true;
    expect(code.includes('void 0') && code.includes('null')).to.be.true;
  });

  it('build ecmascript', async function() {
    const { code } = await transformCode(`const a = 5;
    async function func() {}`, {
      env: { ecmascript: true }
    });

    expect(code.includes('const a = 5;')).to.be.true;
    expect(code.includes('async function')).to.be.true;
  });

  it('build typescript', async function() {
    const { code } = await transformCode('const a: number = 5;', {
      typescript: { use: true }
    });

    expect(code.includes('var a = 5;')).to.be.true;
  });
});