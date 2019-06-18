import { Context } from 'koa';
import {
  formatTemplateData,
  cleanRequireCache,
  folderPathAnalyze,
  filePathAnalyze,
  requireModule,
  isReadStream, readStream
} from '../utils/utils';
import { getControllersFiles, getControllerData } from '../utils/controllers';
import createRenderEngine from '../utils/createRenderEngine';
import { SweetOptions } from '../utils/types';

// 渲染新的html
function preRenderInit(sweetOptions: SweetOptions): Function {
  const basicPath: string = sweetOptions.basicPath;

  return async function preRender(
    ctxPath: string, // 相对路径
    ctx: Context,
    serverRenderFile: string
  ): Promise<string> {
    cleanRequireCache(serverRenderFile);

    const renderEngine: Function = createRenderEngine(sweetOptions.renderType);
    const controllersMap: Map<string, string> = await getControllersFiles(basicPath);
    const folderPathFile: string = `${ folderPathAnalyze(ctxPath) }.js`; // 格式化为：path/to/file.js
    const formatFile: string = `${ filePathAnalyze(ctxPath) }.js`; // 格式化为：path.to.file.js
    const data: any = await getControllerData(ctx, sweetOptions, controllersMap, folderPathFile, formatFile);

    // ssr渲染
    const html: Buffer = ctx.body;
    const server: Function = requireModule(serverRenderFile);
    const result: any /* Stream | string */ = await server(ctxPath, ctx, data.initialState);
    const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

    return renderEngine(html.toString(), formatTemplateData({
      render,
      ...data
    }));
  };
}

export default preRenderInit;