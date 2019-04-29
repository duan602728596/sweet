import * as Koa from 'koa';
import * as ejs from 'ejs';
import { formatTemplateData, folderPathAnalyze, filePathAnalyze, requireModule, isReadStream, readStream } from './utils';
import { getControllersFilesSync, getControllerData } from './controllers';
import { SweetOptions } from './types';

// 渲染新的html
function preRenderInit(sweetOptions: SweetOptions): Function {
  // 获取controllers文件
  const basicPath: string = sweetOptions.basicPath;
  const controllersMap: Map<string, string> = getControllersFilesSync(basicPath);

  return async function preRender(
    ctxPath: string,
    ctx: Koa.Context,
    html: Buffer,
    serverRenderFile: string
  ): Promise<string> {
    try {
      const folderPathFile: string = `${ folderPathAnalyze(ctxPath) }.js`; // 格式化为：path/to/file.js
      const formatFile: string = `${ filePathAnalyze(ctxPath) }.js`; // 格式化为：path.to.file.js
      const data: any = await getControllerData(ctx, sweetOptions, controllersMap, folderPathFile, formatFile);

      // ssr渲染
      const server: Function = requireModule(serverRenderFile);
      const result: any /* Stream | string */ = await server(ctxPath, ctx, data.initialState);
      const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

      return ejs.render(html.toString(), formatTemplateData({
        render,
        ...data
      }));
    } catch (err) {
      console.error(err);

      return '';
    }
  };
}


export default preRenderInit;