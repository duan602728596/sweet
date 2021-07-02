import { isFileExists } from '@sweet-milktea/utils';
import type Koa from 'koa';
import type Router from '@koa/router';
import { defaultApiPath, __require } from './utils';
import type { SweetOptions } from './types';

/**
 * 本地api
 * TODO: 本地api无法清除缓存
 */
async function createApi(sweetOptions: SweetOptions, router: Router, app: Koa, isDevelopment: boolean): Promise<void> {
  try {
    const findFiles: Array<string> = defaultApiPath(sweetOptions.basicPath);

    if (sweetOptions.apiFile) {
      findFiles.unshift(sweetOptions.apiFile);
    }

    for (const findFile of findFiles) {
      if (await isFileExists(findFile)) {
        const routers: Function = await __require<Function>(findFile);

        await routers(router, sweetOptions, app);
        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default createApi;