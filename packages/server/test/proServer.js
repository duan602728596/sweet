import path from 'path';
import { expect } from 'chai';
import axios from 'axios';
import webpack from 'webpack';
import { config as webpackConfig, callback } from '@sweet/milktea';
import proServer from '../lib/proServer';

const compiler: Object = webpack(webpackConfig({
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/'
  },
  html: [{ template: path.join(__dirname, 'src/index.pug') }]
}, 'production'));

function runBuild(): Promise{
  compiler.run(callback);

  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 15000);
  });
}

function runServer(): Promise{
  proServer({
    serverRoot: 'test/build'
  });

  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 3000);
  });
}

describe('production server', function(): void{
  it('run pro server', async function(): Promise<void>{
    await runBuild();
    await runServer();

    const resHtml: Object = await axios.get('http://127.0.0.1:5052');
    const resJs: Object = await axios.get('http://127.0.0.1:5052/app.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});