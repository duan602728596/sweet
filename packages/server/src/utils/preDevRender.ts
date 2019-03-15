import * as Koa from 'koa';
import { replaceTemplate, cleanRequireCache, folderPathAnalyze, filePathAnalyze, requireModule, isReadStream, readStream } from './utils';
import { getControllersFiles } from './controllers';
import { SweetOptions } from './types';

// 渲染新的html
async function preRender(
  file: string, // 相对路径
  ctx: Koa.Context,
  serverRenderFile: string,
  sweetOptions: SweetOptions
): Promise<string> {
  cleanRequireCache(serverRenderFile);

  const basicPath: string = sweetOptions.basicPath;
  const filesMap: Map<string, string> = await getControllersFiles(basicPath);
  const folderPathFile: string = `${ folderPathAnalyze(file) }.js`; // 格式化为：path/to/file.js
  const formatFile: string = `${ filePathAnalyze(file) }.js`; // 格式化为：path.to.file.js
  let data: any = {};

  // 查找对应的controller文件
  if (filesMap.has(folderPathFile)) {
    // 查找文件夹
    const file: string | undefined = filesMap.get(folderPathFile);

    if (file) {
      cleanRequireCache(file);

      const module: Function = requireModule(file);

      data = await module(ctx, sweetOptions);
    }
  } else if (filesMap.has(formatFile)) {
    // 查找文件
    const file: string | undefined = filesMap.get(formatFile);

    if (file) {
      cleanRequireCache(formatFile);

      const module: Function = requireModule(file);

      data = await module(ctx, sweetOptions);
    }
  } else if (filesMap.has('default.js')) {
    // 查找默认文件
    const defaultFile: string | undefined = filesMap.get('/default.js');

    if (defaultFile) {
      cleanRequireCache(defaultFile);

      const module: Function = requireModule(defaultFile);

      data = await module(ctx, sweetOptions);
    }
  }

  // ssr渲染
  const html: Buffer = ctx.body;
  const server: Function = requireModule(serverRenderFile);
  const result: any /* Stream | string */ = await server(file, ctx, data.initialState);
  const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

  return replaceTemplate(html.toString(), {
    render,
    ...data
  });
}

export default preRender;