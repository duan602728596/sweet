import { requireCommonjsModule, deleteCacheAndRequireModule, isFileExists } from '@sweet-milktea/utils';
import type Koa from 'koa';
import type Router from '@koa/router';
import { defaultApiPath } from './utils';
import type { SweetOptions } from './types';

/**
 * 本地api
 * TODO: 本地api无法清除缓存
 */
async function createApi(sweetOptions: SweetOptions, router: Router, app: Koa, isDevelopment: boolean): Promise<void> {
  try {
    const defaultApi: { ts: string; tsx: string; js: string } = defaultApiPath(sweetOptions.basicPath);
    const findFiles: Array<string> = [defaultApi.ts, defaultApi.tsx, defaultApi.js];

    if (sweetOptions.apiFile) {
      findFiles.unshift(sweetOptions.apiFile);
    }

    for (const findFile of findFiles) {
      if (await isFileExists(findFile)) {
        const routers: Function = isDevelopment
          ? await deleteCacheAndRequireModule(findFile)
          : await requireCommonjsModule(findFile);

        await routers(router, sweetOptions, app);
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default createApi;