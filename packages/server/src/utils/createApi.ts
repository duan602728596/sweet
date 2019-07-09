import * as fs from 'fs';
import * as Koa from 'koa';
import * as Router from '@koa/router';
import * as register from '@babel/register';
import { defaultApiPath, deleteCacheAndRequireModule, requireModule } from './utils';
import registerConfig from './registerConfig';
import { SweetOptions } from './types';

/* 本地api，本地api无法清除缓存 */
function createApi(sweetOptions: SweetOptions, router: Router, app: Koa, isDevelopment: boolean): void {
  const defaultApi: string = defaultApiPath(sweetOptions.basicPath);

  if (fs.existsSync(defaultApi)) {
    register(registerConfig(sweetOptions));

    const routers: Function = isDevelopment
      ? deleteCacheAndRequireModule(defaultApi)
      : requireModule(defaultApi);

    routers(router, sweetOptions, app);
  }
}

export default createApi;