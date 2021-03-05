import path from 'path';
import fs from 'fs';
import util from 'util';
import { expect } from 'chai';
import rimraf from 'rimraf';
import { build, serverRenderBuild } from '../lib/milktea-vite';

const rimrafPromise = util.promisify(rimraf);

const root = path.join(__dirname, 'root');
const dist = path.join(__dirname, 'dist');
const distServer = path.join(__dirname, 'dist-server');

describe('build and server', function() {
  it('will compile client files and server-side files', async function() {
    await build({
      sweetConfig: {
        frame: 'react',
        vite: {
          root,
          build: {
            outDir: dist
          }
        }
      },
      mode: 'production'
    });
    await serverRenderBuild({
      sweetConfig: {
        frame: 'react',
        vite: {
          root,
          build: {
            outDir: distServer
          }
        },
        serverEntry: path.join(__dirname, 'root/entry-server.jsx')
      },
      mode: 'production'
    });

    // eslint-disable-next-line import/no-unresolved
    const server = require('./dist-server/entry-server');

    expect(server.default()).to.be.a('string');
    expect(fs.existsSync(path.join(__dirname, 'dist'))).to.be.true;
  });

  after(async function() {
    await Promise.all([
      rimrafPromise(dist),
      rimrafPromise(distServer)
    ]);
  });
});