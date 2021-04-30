import path from 'path';
import { expect } from 'chai';
import { requireModule, requireCommonjsModule } from '../esm/index.js';

const __dirname = decodeURIComponent(path.dirname(import.meta.url.replace(/^file:\/{2}/, '')));

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

    expect(m1).to.eql('cjs module');
  });
});