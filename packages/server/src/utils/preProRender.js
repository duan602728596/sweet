import fs from 'fs';
import path from 'path';
import { replaceTemplate, defaultInterfacePath, pathAnalyze } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, serverRenderFile: string): Promise<Object>{
  const formatFile: string = path.join(defaultInterfacePath, pathAnalyze(file));
  const html: ArrayBuffer = ctx.body;
  const data: Object = fs.existsSync(formatFile) ? await require(formatFile)(ctx) : {};
  const server: Function = require(serverRenderFile).default;
  const render: Object = server(file, {}, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

module.exports = preRender;