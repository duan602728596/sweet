import fs from 'fs';
import { replaceTemplate, defaultInterfacePath } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, serverRenderFile: string): Promise<Object>{
  const html: ArrayBuffer = ctx.body;
  const data: Object = fs.existsSync(defaultInterfacePath) ? await require(defaultInterfacePath)(file, ctx) : {};
  const server: Function = require(serverRenderFile).default;
  const render: Object = server(file, {}, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

module.exports = preRender;