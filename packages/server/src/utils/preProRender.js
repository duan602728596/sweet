import fs from 'fs';
import path from 'path';
import { replaceTemplate, defaultInterfacePath, pathAnalyze } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, html: ArrayBuffer, serverRenderFile: string): Promise<Object>{
  const formatFile: string = `${ path.join(defaultInterfacePath, pathAnalyze(file)) }.js`;
  const data: Object = fs.existsSync(formatFile) ? await require(formatFile)(ctx) : {};
  const server: Function = require(serverRenderFile).default;
  const render: Object = await server(file, ctx, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

module.exports = preRender;