import type * as Stream from 'node:stream';
import { pathToRegexp, type Keys } from 'path-to-regexp';
import { requireModule } from '@sweet-milktea/utils';
import type { Context } from 'koa';
import { formatTemplateData, isReadStream, readStream, __fixModuleImportDefaultDefault } from '../utils/utils.js';
import { getControllersFiles } from '../utils/controllers.js';
import createRenderEngine from '../utils/createRenderEngine.js';
import type { SweetOptions, ControllersModule } from '../utils/types.js';

// 渲染新的html
async function preRenderInit(sweetOptions: SweetOptions): Promise<Function> {
  const renderEngine: Function = await createRenderEngine(sweetOptions.renderType); // 获取渲染器
  const controllersModules: Array<ControllersModule> = await getControllersFiles(sweetOptions); // 获取所有的controllers模块

  return async function preRender(ctxPath: string, ctx: Context, html: Buffer, serverRenderEntry: string): Promise<void> {
    try {
      // 获取数据
      const index: number = controllersModules.findIndex(function(o: ControllersModule): boolean {
        const { regexp }: { regexp: RegExp; keys: Keys } = pathToRegexp(o.url);

        return regexp.exec(ctxPath) !== null && regexp.exec(ctxPath) !== undefined;
      });
      const data: any = index >= 0 ? await controllersModules[index].handler(ctx, sweetOptions) : {};

      // 挂载自定义的渲染方法
      ctx.renderHtml = function(r: string): string {
        return renderEngine(html.toString(), formatTemplateData({
          render: r,
          ...data
        }));
      };

      // ssr渲染
      const server: Function = __fixModuleImportDefaultDefault(await requireModule(serverRenderEntry));
      const result: Stream | string | undefined = await server(ctxPath, ctx, data.initialState);

      if (result) {
        const render: string = isReadStream(result) ? (await readStream(result)).toString() : result;
        const responseBody: string = renderEngine(html.toString(), formatTemplateData({
          render,
          ...data
        }));

        ctx.body = responseBody;
      }
    } catch (err) {
      console.error(err);

      ctx.status = 500;
      ctx.body = `<pre style="font-size: 14px; white-space: pre-wrap;">${ err.stack.toString() }</pre>`;
    }
  };
}


export default preRenderInit;