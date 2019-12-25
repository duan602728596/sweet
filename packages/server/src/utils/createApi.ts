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
    const defaultApi: string = defaultApiPath(sweetOptions.basicPath);

    if (sweetOptions.apiFile && fs.existsSync(sweetOptions.apiFile)) {
      const routers: Function = isDevelopment
        ? deleteCacheAndRequireModule(sweetOptions.apiFile)
        : requireModule(sweetOptions.apiFile);

      await routers(router, sweetOptions, app);
    } else if (fs.existsSync(defaultApi)) {
      const routers: Function = isDevelopment
        ? deleteCacheAndRequireModule(defaultApi)
        : requireModule(defaultApi);

      await routers(router, sweetOptions, app);
    }
  } catch (err) {
    console.error(err);
  }
}

export default createApi;