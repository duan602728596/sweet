import path from 'node:path';
import fs from 'node:fs';
import { expect } from 'chai';
import {
  requireModule,
  requireCommonjsModule,
  requireJson,
  requireModuleWithoutCache
} from '../lib/index.js';
import { metaHelper } from '../esm/index.js';

const { __dirname } = metaHelper(import.meta.url);
const cacheJs = path.join(__dirname, '.cache-cjs.js');

describe('cjs test', function() {
  it('requireModule test', function() {
    const m1 = requireModule(path.join(__dirname, 'cjsUtils/module.js'));
    const m2 = requireModule(path.join(__dirname, 'cjsUtils/module.js'), true);

    expect(m1).to.eql('cjs module');
    expect(m2.default).to.eql('cjs module');
    expect(m2.name).to.eql('cjs module name');
  });

  it('requireCommonjsModule test', function() {
    const m1 = requireCommonjsModule(path.join(__dirname, 'cjsUtils/module.js'));
    const m2 = requireCommonjsModule(path.join(__dirname, 'cjsUtils/module.js'), true);

    expect(m1).to.eql('cjs module');
    expect(m2.default).to.eql('cjs module');
    expect(m2.name).to.eql('cjs module name');
  });

  it('requireJson test', async function() {
    const m = await requireJson(path.join(__dirname, 'cjsUtils/json.json'));

    expect(m).to.eql({
      filename: 'cjs json',
      data: 32
    });
  });

  it('deleteCacheAndRequireModule test', async function() {
    await fs.promises.writeFile(cacheJs, 'module.exports = { a: 1 };');

    const m1 = await requireModuleWithoutCache(cacheJs);

    expect(m1).to.eql({ a: 1 });

    await fs.promises.writeFile(cacheJs, 'module.exports = { a: 2 };');

    const m2 = await requireModuleWithoutCache(cacheJs);

    expect(m2).to.eql({ a: 2 });
  });

  after(async function() {
    await fs.promises.rm(cacheJs);
  });
});