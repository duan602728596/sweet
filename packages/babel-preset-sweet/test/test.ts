import { describe, test } from 'node:test';
import { ok } from 'node:assert/strict';
import { transformAsync, type FileResult } from '@babel/core';
import babelPresetSweet from '../dist/esm/index.js';
import type { IBabelPresetSweetOptions } from '../dist/types/types.js';

/**
 * 编译代码
 * @param { string } code - 代码
 * @param { object } [options]
 */
async function transform(code: string, options?: IBabelPresetSweetOptions): Promise<FileResult> {
  const transformResult: FileResult | null = await transformAsync(code, {
    presets: [
      [babelPresetSweet, options ?? {}]
    ]
  });

  if (!transformResult) {
    throw new Error('Transform code failed.');
  }

  return transformResult;
}

describe('babel插件测试', function(): void {
  test('should build JavaScript success', async function(): Promise<void> {
    const rawCode: string = `
      const a = 5;
      const b = <div />;
      const c = {};
      const d = c?.e;
    `;
    const { code }: FileResult = await transform(rawCode);

    if (!code) {
      throw new Error('Code is null.');
    }

    ok(code.includes('var a = 5;'));
    ok(code.includes('jsx'));
    ok(code.includes('void 0') && code.includes('null'));
  });

  test('should build ECMAScript success', async function(): Promise<void> {
    const rawCode: string = `
      const a = 5;
      async function func() {}
    `;
    const options: IBabelPresetSweetOptions = {
      env: { ecmascript: true }
    };
    const { code }: FileResult = await transform(rawCode, options);

    if (!code) {
      throw new Error('Code is null.');
    }

    ok(code.includes('const a = 5;'));
    ok(code.includes('async function'));
  });

  test('should build TypeScript success', async function(): Promise<void> {
    const rawCode: string = `
      import { type ReactElement } from 'react';

      const a: number = 5;

      function App(props: {}): ReactElement {
        return <div>{ a }</div>;
      }`
    ;
    const options: IBabelPresetSweetOptions = {
      typescript: { use: true }
    };
    const { code }: FileResult = await transform(rawCode, options);

    if (!code) {
      throw new Error('Code is null.');
    }

    ok(code.includes('var a = 5;'));
    ok(code.includes('_jsx("div"') || code.includes('jsx)("div"'));
  });

  test('should build node success', async function(): Promise<void> {
    const rawCode: string = `
      import path from 'node:path';
      import { index } from './index.js';
    `;
    const options: IBabelPresetSweetOptions = {
      env: {
        nodeEnv: true,
        modules: 'commonjs',
        ecmascript: true
      }
    };
    const { code }: FileResult = await transform(rawCode, options);

    if (!code) {
      throw new Error('Code is null.');
    }

    ok(code.includes('require'));
  });

  test('should build code has polyfill', async function() {
    const rawCode: string = `
      globalThis.a = 5;

      'Hello, world.'.replaceAll(/,/, '');

      function u() {
        using x = new B()
        x.run()
      }

      const map = new Map();
      const value = map.getOrInsert(5);
    `;
    const { code }: FileResult = await transform(rawCode);

    if (!code) {
      throw new Error('Code is null.');
    }

    ok(code.includes('helpers/usingCtx'));
    ok(code.includes('esnext.global-this'));
    ok(code.includes('esnext.string.replace-all'));
  });
});