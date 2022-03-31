import type * as Stream from 'stream';
import { pathToRegexp } from 'path-to-regexp';
import { requireModuleWithoutCache } from '@sweet-milktea/utils';
import type { Context } from 'koa';
import { formatTemplateData, requireViteModule, isReadStream, readStream, __fixModuleImportDefaultDefault } from '../utils/utils';
import { getControllersFiles } from '../utils/controllers';
import createRenderEngine from '../utils/createRenderEngine';
import type { SweetOptions, ControllersModule } from '../utils/types';

// 渲染新的html
async function preRenderInit(sweetOptions: SweetOptions): Promise<Function> {
  const renderEngine: Function = await createRenderEngine(sweetOptions.renderType); // 获取渲染器
  const getSSRDataFunc: Function = sweetOptions.vite
    ? requireViteModule(sweetOptions)
    : requireModuleWithoutCache;

  /**
   * @param { string } ctxPath: 相对路径
   * @param { Context } ctx: koa ctx
   * @param { string } serverRenderEntry: ssr文件入口
   */
  return async function preRender(ctxPath: string, ctx: Context, serverRenderEntry: string): Promise<void> {
    // 获取所有的controllers模块
    const controllersModules: Array<ControllersModule> = await getControllersFiles(sweetOptions, true);

    // 获取数据
    const index: number = controllersModules.findIndex(function(o: ControllersModule): boolean {
      const regexp: RegExp = pathToRegexp(o.url);

      return regexp.exec(ctxPath) !== null && regexp.exec(ctxPath) !== undefined;
    });
    const data: any = index >= 0 ? await controllersModules[index].handler(ctx, sweetOptions) : {};
    const html: Buffer = ctx.body as Buffer;

    // 挂载自定义的渲染方法
    ctx.renderHtml = function(r: string): string {
      return renderEngine(html.toString(), formatTemplateData({
        render: r,
        ...data
      }));
    };

    // ssr渲染
    const server: Function = __fixModuleImportDefaultDefault(await getSSRDataFunc(serverRenderEntry));
    const result: Stream | string | undefined = await server(ctxPath, ctx, data.initialState);

    if (result) {
      const render: string | undefined = isReadStream(result) ? (await readStream(result)).toString() : result;
      const responseBody: string = renderEngine(html.toString(), formatTemplateData({
        render,
        ...data
      }));

      ctx.body = responseBody;
    }
  };
}

export default preRenderInit;