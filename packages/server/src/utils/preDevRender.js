import fs from 'fs';
import { replaceTemplate, defaultInterfacePath, cleanRequireCache } from './utils';

// 渲染新的html
async function preRender(file: string, ctx: Object, serverRenderFile: string): Promise<Object>{
  cleanRequireCache(defaultInterfacePath);
  cleanRequireCache(serverRenderFile);

  const html: ArrayBuffer = ctx.body;
  const data: Object = fs.existsSync(defaultInterfacePath) ? await require(defaultInterfacePath)(file, ctx) : {};
  const server: Function = require(serverRenderFile).default;
  const render: string = server(file, {}, data.initialState);

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

export default preRender;