import * as Koa from 'koa';
import { replaceTemplate, folderPathAnalyze, filePathAnalyze, requireModule, isReadStream, readStream } from './utils';
import { getControllersFilesSync } from './controllers';
import { SweetOptions } from './types';

// 渲染新的html
function preRenderInit(sweetOptions: SweetOptions): Function {
  // 获取controllers文件
  const basicPath: string = sweetOptions.basicPath;
  const controllersMap: Map<string, string> = getControllersFilesSync(basicPath);

  return async function preRender(
    file: string,
    ctx: Koa.Context,
    html: Buffer,
    serverRenderFile: string
  ): Promise<string> {
    const folderPathFile: string = `${ folderPathAnalyze(file) }.js`; // 格式化为：path/to/file.js
    const formatFile: string = `${ filePathAnalyze(file) }.js`; // 格式化为：path.to.file.js
    let data: any = {};

    // 查找对应的controller文件
    if (controllersMap.has(folderPathFile)) {
      // 查找文件夹
      const file: string | undefined = controllersMap.get(folderPathFile);

      if (file) {
        const module: Function = requireModule(file);

        data = await module(ctx, sweetOptions);
      }
    } else if (controllersMap.has(formatFile)) {
      // 查找文件
      const file: string | undefined = controllersMap.get(formatFile);

      if (file) {
        const module: Function = requireModule(file);

        data = await module(ctx, sweetOptions);
      }
    } else if (controllersMap.has('default.js')) {
      // 查找默认文件
      const defaultFile: string | undefined = controllersMap.get('default.js');

      if (defaultFile) {
        const module: Function = requireModule(defaultFile);

        data = await module(ctx, sweetOptions);
      }
    }

    // ssr渲染
    const server: Function = requireModule(serverRenderFile);
    const result: any /* Stream | string */ = await server(file, ctx, data.initialState);
    const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

    return replaceTemplate(html.toString(), {
      render,
      ...data
    });
  };
}


export default preRenderInit;