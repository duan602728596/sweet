import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import { defaultApiPath, deleteCacheAndRequireModule, requireModule } from './utils';
import { SweetOptions } from './types';

/**
 * 本地api
 * TODO: 本地api无法清除缓存
 */
async function createApi(sweetOptions: SweetOptions, router: Router, app: Koa, isDevelopment: boolean): Promise<void> {
  try {
    const defaultApi: { js: string; ts: string } = defaultApiPath(sweetOptions.basicPath);
    const findFiles: Array<string> = [defaultApi.ts, defaultApi.js];

    if (sweetOptions.apiFile) {
      findFiles.unshift(sweetOptions.apiFile);
    }

    for (const findFile of findFiles) {
      if (fs.existsSync(findFile)) {
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