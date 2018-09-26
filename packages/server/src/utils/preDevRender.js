import fs from 'fs';
import path from 'path';
import { replaceTemplate, defaultInterfacePath, cleanRequireCache, pathAnalyze } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, serverRenderFile: string): Promise<Object>{
  cleanRequireCache(serverRenderFile);

  const formatFile: string = `${ path.join(defaultInterfacePath, pathAnalyze(file)) }.js`;
  let data: Object = {};

  if(fs.existsSync(formatFile)){
    cleanRequireCache(formatFile);
    data = await require(formatFile)(ctx);
  }

  const html: ArrayBuffer = ctx.body;

  const server: Function = require(serverRenderFile).default;
  const render: string = await server(file, ctx, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

export default preRender;