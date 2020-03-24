import * as Koa from 'koa';
import * as Router from '@koa/router';
import { defaultApiPath, deleteCacheAndRequireModule, requireModule, isExists } from './utils';
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
      if (await isExists(findFile)) {
        const routers: Function = isDevelopment
          ? deleteCacheAndRequireModule(findFile)
          : requireModule(findFile);

        await routers(router, sweetOptions, app);
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default createApi;