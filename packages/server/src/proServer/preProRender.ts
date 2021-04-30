import type * as Stream from 'stream';
import { pathToRegexp } from 'path-to-regexp';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { Context } from 'koa';
import { formatTemplateData, isReadStream, readStream } from '../utils/utils';
import { getControllersFiles } from '../utils/controllers';
import createRenderEngine from '../utils/createRenderEngine';
import type { SweetOptions, ControllersModule } from '../utils/types';

// 渲染新的html
async function preRenderInit(sweetOptions: SweetOptions): Promise<Function> {
  const renderEngine: Function = await createRenderEngine(sweetOptions.renderType); // 获取渲染器
  const controllersModules: Array<ControllersModule> = await getControllersFiles(sweetOptions); // 获取所有的controllers模块

  return async function preRender(ctxPath: string, ctx: Context, html: Buffer, serverRenderEntry: string): Promise<string> {
    try {
      // 获取数据
      const index: number = _.findIndex(controllersModules, function(o: ControllersModule): boolean {
        const regexp: RegExp = pathToRegexp(o.url);

        return regexp.exec(ctxPath) !== null && regexp.exec(ctxPath) !== undefined;
      });
      const data: any = index >= 0 ? await controllersModules[index].handler(ctx, sweetOptions) : {};

      // ssr渲染
      const server: Function = await requireModule(serverRenderEntry);
      const result: Stream | string
        = await ('default' in server ? server['default'] : server)(ctxPath, ctx, data.initialState);
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