import { Context } from 'koa';
import * as Stream from 'stream';
import {
  formatTemplateData,
  folderPathAnalyze,
  filePathAnalyze,
  deleteCacheAndRequireModule,
  isReadStream,
  readStream
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
    serverRenderEntry: string
  ): Promise<string> {
    const renderEngine: Function = createRenderEngine(sweetOptions.renderType);
    const controllersMap: Map<string, string> = await getControllersFiles(basicPath, sweetOptions.controllersDir);
    const folderPathFile: string = folderPathAnalyze(ctxPath); // 格式化为：path/to/file，没有扩展名
    const formatFile: string = filePathAnalyze(ctxPath);       // 格式化为：path.to.file，没有扩展名
    const data: any = await getControllerData(ctx, sweetOptions, controllersMap, folderPathFile, formatFile, true);

    // ssr渲染
    const html: Buffer = ctx.body;
    const server: Function = deleteCacheAndRequireModule(serverRenderEntry);
    const result: Stream | string = await server(ctxPath, ctx, data.initialState);
    const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

    return renderEngine(html.toString(), formatTemplateData({
      render,
      ...data
    }));
  };
}

export default preRenderInit;