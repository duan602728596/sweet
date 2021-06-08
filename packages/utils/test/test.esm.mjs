import path from 'path';
import fs from 'fs';
import { expect } from 'chai';
import {
  requireModule,
  requireCommonjsModule,
  requireJson,
  deleteCacheAndRequireModule,
  metaHelper
} from '../esm/index.js';

const { __dirname } = metaHelper(import.meta.url);
const cacheJs = path.join(__dirname, '.cache.js');

describe('esm test', function() {
  it('requireModule test', async function() {
    const m1 = await requireModule(path.join(__dirname, 'esmUtils/module.mjs'));
    const m2 = await requireModule(path.join(__dirname, 'esmUtils/module.mjs'), true);

    expect(m1).to.eql('module');
    expect(m2.default).to.eql('module');
    expect(m2.name).to.eql('module name');
  });

  it('requireCommonjsModule test', async function() {
    const m1 = await requireCommonjsModule(path.join(__dirname, 'cjsUtils/module.js'));
    const m2 = await requireCommonjsModule(path.join(__dirname, 'cjsUtils/module.js'), true);

    expect(m1).to.eql('cjs module');
    expect(m2.default).to.eql('cjs module');
    expect(m2.name).to.eql('cjs module name');
  });

  it('requireJson test', async function() {
    const m = await requireJson(path.join(__dirname, 'esmUtils/json.json'));

    expect(m).to.eql({
      filename: 'json',
      data: 12
    });
  });

  it('deleteCacheAndRequireModule test', async function() {
    await fs.promises.writeFile(cacheJs, 'module.exports = { a: 1 };');

    const m1 = await deleteCacheAndRequireModule(cacheJs);

    expect(m1).to.eql({ a: 1 });

    await fs.promises.writeFile(cacheJs, 'module.exports = { a: 2 };');

    const m2 = await deleteCacheAndRequireModule(cacheJs);

    expect(m2).to.eql({ a: 2 });
  });

  after(async function() {
    await fs.promises.rm(cacheJs);
  });
});