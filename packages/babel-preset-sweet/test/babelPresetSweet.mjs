import { expect } from 'chai';
import { transformAsync } from '@babel/core';

function getTargets(options) {
  let babelBuildTargets;

  if (options?.targets) {
    babelBuildTargets = options.targets;
  } else {
    if (options?.ecmascript) {
      babelBuildTargets = {
        browsers: options?.nodeEnv ? ['node 20'] : ['last 5 Chrome versions']
      };
    } else {
      babelBuildTargets = {
        browsers: options?.nodeEnv ? ['node 18'] : [
          'last 10 versions',
          'last 2 year'
        ]
      };
    }
  }

  return babelBuildTargets;
}

/* 编译代码 */
async function transformCode(code, options, transformOptions = {}) {
  return transformAsync(code, {
    targets: getTargets(options),
    presets: [
      [(await import('../lib/index.js')).default, options]
    ]
  });
}

async function transformCodeESM(code, options, transformOptions = {}) {
  return transformAsync(code, {
    targets: getTargets(options),
    presets: [
      [(await import('../esm/index.js')).default, options]
    ]
  });
}

describe('babel-preset-sweet', function() {
  it('build javascript', async function() {
    const rawCode = `const a = 5;
                     const b = <div />;
                     const c = {};
                     const d = c?.e;`
    const [{ code }, { code: codeESM }] = await Promise.all([
      transformCode(rawCode),
      transformCodeESM(rawCode)
    ]);

    expect(code.includes('var a = 5;')).to.be.true;
    expect(code.includes('jsx')).to.be.true;
    expect(code.includes('void 0') && code.includes('null')).to.be.true;
    expect(codeESM.includes('var a = 5;')).to.be.true;
    expect(codeESM.includes('jsx')).to.be.true;
    expect(codeESM.includes('void 0') && code.includes('null')).to.be.true;
  });

  it('build ecmascript', async function() {
    const rawCode = `const a = 5;
                     async function func() {}`;
    const options = {
      env: { ecmascript: true }
    };
    const [{ code }, { code: codeESM }] = await Promise.all([
      transformCode(rawCode, options),
      transformCodeESM(rawCode, options)
    ]);

    expect(code.includes('const a = 5;')).to.be.true;
    expect(code.includes('async function')).to.be.true;
    expect(codeESM.includes('const a = 5;')).to.be.true;
    expect(codeESM.includes('async function')).to.be.true;
  });

  it('build typescript', async function() {
    const rawCode = `import { type ReactElement } from 'react';

const a: number = 5;

 function App(props: {}): ReactElement {
   return <div>{ a }</div>;
 }`;
    const options = {
      typescript: { use: true }
    };
    const [{ code }, { code: codeESM }] = await Promise.all([
      transformCode(rawCode, options, { isTs: true }),
      transformCodeESM(rawCode, options, { isTs: true })
    ]);

    expect(code.includes('var a = 5;')).to.be.true;
    expect(codeESM.includes('var a = 5;')).to.be.true;
    expect(code.includes('_jsx("div"')).to.be.true;
    expect(codeESM.includes('_jsx("div"')).to.be.true;
  });

  it('build transform-runtime', async function() {
    const rawCode = 'const isArray = Array.isArray([]);';
    const options = {
      env: { modules: 'commonjs' }
    };
    const [
      { code: code0 },
      { code: code1 },
      { code: code0ESM },
      { code: code1ESM }
    ] = await Promise.all([
      transformCode(rawCode),
      transformCode(rawCode, options),
      transformCodeESM(rawCode),
      transformCodeESM(rawCode, options)
    ]);

    expect(code0.includes('import')).to.be.true;
    expect(code1.includes('require')).to.be.true;
    expect(code0ESM.includes('import')).to.be.true;
    expect(code1ESM.includes('require')).to.be.true;
  });

  it('build polyfill', async function() {
    const rawCode = "globalThis.a = 5; 'Hello, world.'.replaceAll(/,/, ''); ";
    const [{ code }, { code: codeESM }] = await Promise.all([
      transformCode(rawCode),
      transformCodeESM(rawCode)
    ]);

    expect(code.includes('_globalThis')).to.be.true;
    expect(code.includes('_replaceAllInstanceProperty')).to.be.true;
    expect(codeESM.includes('_globalThis')).to.be.true;
    expect(codeESM.includes('_replaceAllInstanceProperty')).to.be.true;
  });
});