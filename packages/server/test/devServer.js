import path from 'path';
import { expect } from 'chai';
import axios from 'axios';
import webpack from 'webpack';
import { config as webpackConfig } from '@sweet/milktea';
import devServer from '../src/devServer';

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
}, 'development'));

function runServer(): Promise{
  devServer({ compiler });
  return new Promise((resolve: Function, reject: Function): void=>{
    setTimeout((): void=>{
      resolve();
    }, 15000);
  });
}

describe('development server', async function(): void{
  it('run dev server', async function(): Promise<void>{
    await runServer();

    const resHtml: Object = await axios.get('http://127.0.0.1:5050');
    const resJs: Object = await axios.get('http://127.0.0.1:5050/app.js');

    expect(resHtml.status).to.be.equal(200);
    expect(resJs.status).to.be.equal(200);
  });
});