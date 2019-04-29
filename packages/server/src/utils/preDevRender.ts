import * as Koa from 'koa';
import * as ejs from 'ejs';
import {
  formatTemplateData, cleanRequireCache, folderPathAnalyze, filePathAnalyze, requireModule,
  isReadStream, readStream
} from './utils';
import { getControllersFiles, getControllerData } from './controllers';
import { SweetOptions } from './types';

// 渲染新的html
async function preRender(
  ctxPath: string, // 相对路径
  ctx: Koa.Context,
  serverRenderFile: string,
  sweetOptions: SweetOptions
): Promise<string> {
  cleanRequireCache(serverRenderFile);

  const basicPath: string = sweetOptions.basicPath;
  const controllersMap: Map<string, string> = await getControllersFiles(basicPath);
  const folderPathFile: string = `${ folderPathAnalyze(ctxPath) }.js`; // 格式化为：path/to/file.js
  const formatFile: string = `${ filePathAnalyze(ctxPath) }.js`; // 格式化为：path.to.file.js
  const data: any = await getControllerData(ctx, sweetOptions, controllersMap, folderPathFile, formatFile);

  // ssr渲染
  const html: Buffer = ctx.body;
  const server: Function = requireModule(serverRenderFile);
  const result: any /* Stream | string */ = await server(ctxPath, ctx, data.initialState);
  const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

  return ejs.render(html.toString(), formatTemplateData({
    render,
    ...data
  }));
}

export default preRender;