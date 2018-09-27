import fs from 'fs';
import path from 'path';
import { replaceTemplate, defaultInterfacePath, pathAnalyze } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, html: ArrayBuffer, serverRenderFile: string): Promise<Object>{
  const formatFile: string = `${ path.join(defaultInterfacePath, pathAnalyze(file)) }.js`;
  let data: Object = {};

  // 读取模块
  if(fs.existsSync(formatFile)){
    const file: Object | Function = require(formatFile);

    if('default' in file) data = await file.default(ctx);
    else data = await file(ctx);
  }

  const server: Function = require(serverRenderFile).default;
  const render: Object = await server(file, ctx, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

module.exports = preRender;