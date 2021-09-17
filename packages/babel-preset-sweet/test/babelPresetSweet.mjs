import { promisify } from 'node:util';
import { transform } from '@babel/core';
import { expect } from 'chai';

const transformPromise = promisify(transform);

/* 编译代码 */
async function transformCode(code, options) {
  return transformPromise(code, {
    presets: [
      [(await import('../lib/index.js')).default, options]
    ]
  });
}

describe('babel-preset-sweet', function() {
  it('build javascript', async function() {
    const { code } = await transformCode(`const a = 5;
    const b = <div />;
    const c = {};
    const d = c?.e;`);

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

  it('build transform-runtime', async function() {
    const c = 'const isArray = Array.isArray([]);';
    const { code: code0 } = await transformCode(c);
    const { code: code1 } = await transformCode(c, {
      env: { modules: 'commonjs' }
    });

    expect(code0.includes('import')).to.be.true;
    expect(code1.includes('require')).to.be.true;
  });

  it('build polyfill', async function() {
    const c = "globalThis.a = 5; 'Hello, world.'.replaceAll(/,/, ''); ";
    const { code: code0 } = await transformCode(c, {
      polyfill: true
    });

    expect(code0.includes('globalthis')).to.be.true;
    expect(code0.includes('string.prototype.replaceall')).to.be.true;
  });
});