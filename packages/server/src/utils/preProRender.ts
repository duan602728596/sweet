import * as fs from 'fs';
import * as path from 'path';
import * as Koa from 'koa';
import {
  replaceTemplate, defaultInterfacePath, folderPathAnalyze, filePathAnalyze, defaultInterfaceJsFilename,
  requireModule, isReadStream, readStream, cleanRequireCache
} from './utils';
import { SweetOptions } from './types';

// 渲染新的html
async function preRender(
  file: string,
  ctx: Koa.Context,
  html: Buffer,
  serverRenderFile: string,
  sweetOptions: SweetOptions
): Promise<string> {
  const defaultPath: string = defaultInterfacePath(sweetOptions);
  const folderPathFile: string = `${ path.join(defaultPath, folderPathAnalyze(file)) }.js`; // 文件夹/Path/To/File.js类型
  const formatFile: string = `${ path.join(defaultPath, filePathAnalyze(file)) }.js`;
  let data: any = {};

  // 读取模块
  if (fs.existsSync(folderPathFile)) {
    cleanRequireCache(folderPathFile);

    const file: Function = requireModule(folderPathFile);

    data = await file(ctx, sweetOptions);
  } else if (fs.existsSync(formatFile)) {
    // 加载es6+环境
    const file: Function = requireModule(formatFile);

    data = await file(ctx, sweetOptions);
  } else if (fs.existsSync(defaultInterfaceJsFilename(sweetOptions))) {
    // 读取默认模块
    const defaultFilename: string = defaultInterfaceJsFilename(sweetOptions);

    const file: Function = requireModule(defaultFilename);

    data = await file(ctx, sweetOptions);
  }

  const server: Function = requireModule(serverRenderFile);
  const result: any /* Stream | string */ = await server(file, ctx, data.initialState);
  const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

export default preRender;