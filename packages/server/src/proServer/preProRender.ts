import { Context } from 'koa';
import * as Stream from 'stream';
import {
  formatTemplateData,
  folderPathAnalyze,
  filePathAnalyze,
  requireModule,
  isReadStream,
  readStream
} from '../utils/utils';
import { getControllersFilesSync, getControllerData } from '../utils/controllers';
import createRenderEngine from '../utils/createRenderEngine';
import { SweetOptions } from '../utils/types';

// 渲染新的html
function preRenderInit(sweetOptions: SweetOptions): Function {
  // 获取controllers文件
  const basicPath: string = sweetOptions.basicPath;
  const controllersMap: Map<string, string> = getControllersFilesSync(basicPath, sweetOptions.controllersDir);

  return async function preRender(
    ctxPath: string,
    ctx: Context,
    html: Buffer,
    serverRenderEntry: string
  ): Promise<string> {
    try {
      const renderEngine: Function = createRenderEngine(sweetOptions.renderType);
      const folderPathFile: string = folderPathAnalyze(ctxPath); // 格式化为：path/to/file，没有扩展名
      const formatFile: string = filePathAnalyze(ctxPath);       // 格式化为：path.to.file，没有扩展名
      const data: any = await getControllerData(ctx, sweetOptions, controllersMap, folderPathFile, formatFile, false);

      // ssr渲染
      const server: Function = requireModule(serverRenderEntry);
      const result: Stream | string = await server(ctxPath, ctx, data.initialState);
      const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;

      return renderEngine(html.toString(), formatTemplateData({
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