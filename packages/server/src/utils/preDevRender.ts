import * as Koa from 'koa';
import * as ejs from 'ejs';
import {
  formatTemplateData, cleanRequireCache, folderPathAnalyze, filePathAnalyze, requireModule,
  isReadStream, readStream
} from './utils';
import { getControllersFiles } from './controllers';
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
  let data: any = {};

  // 查找对应的controller文件
  if (controllersMap.has(folderPathFile)) {
    // 查找文件夹
    const file: string | undefined = controllersMap.get(folderPathFile);

    if (file) {
      cleanRequireCache(file);

      const module: Function = requireModule(file);

      data = await module(ctx, sweetOptions);
    }
  } else if (controllersMap.has(formatFile)) {
    // 查找文件
    const file: string | undefined = controllersMap.get(formatFile);

    if (file) {
      cleanRequireCache(file);

      const module: Function = requireModule(file);

      data = await module(ctx, sweetOptions);
    }
  } else if (controllersMap.has('default.js')) {
    // 查找默认文件
    const defaultFile: string | undefined = controllersMap.get('default.js');

    if (defaultFile) {
      cleanRequireCache(defaultFile);

      const module: Function = requireModule(defaultFile);

      data = await module(ctx, sweetOptions);
    }
  }

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