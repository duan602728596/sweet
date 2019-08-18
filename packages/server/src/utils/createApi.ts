import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import { defaultApiPath, deleteCacheAndRequireModule, requireModule } from './utils';
import useRegister from './babelRegister';
import { SweetOptions } from './types';

/* 本地api，本地api无法清除缓存 */
async function createApi(sweetOptions: SweetOptions, router: Router, app: Koa, isDevelopment: boolean): Promise<void> {
  const defaultApi: string = defaultApiPath(sweetOptions.basicPath);

  if (sweetOptions.apiFile && fs.existsSync(sweetOptions.apiFile)) {
    useRegister(sweetOptions);

    const routers: Function = isDevelopment
      ? deleteCacheAndRequireModule(sweetOptions.apiFile)
      : requireModule(sweetOptions.apiFile);

    await routers(router, sweetOptions, app);
  } else if (fs.existsSync(defaultApi)) {
    useRegister(sweetOptions);

    const routers: Function = isDevelopment
      ? deleteCacheAndRequireModule(defaultApi)
      : requireModule(defaultApi);

    await routers(router, sweetOptions, app);
  }
}

export default createApi;