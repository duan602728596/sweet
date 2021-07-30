import { isPlainObject } from 'lodash';
import type { Context } from 'koa';
import type Router from '@koa/router';
import { isFileExists } from '@sweet-milktea/utils';
import { defaultMockPath, __require } from './utils';
import type { SweetOptions } from './types';

type KoaFunc = (ctx: Context, next: Function) => void | Promise<void>;
type Mock = { [key: string]: any | KoaFunc };
type MockFunc = (sweetOptions: SweetOptions) => Mock | Promise<Mock>;
type MockModule = Mock | MockFunc;

function isMock(mockModule: MockModule): mockModule is Mock {
  return isPlainObject(mockModule);
}

function isMockFunc(mockModule: MockModule): mockModule is MockFunc {
  return typeof mockModule === 'function';
}

/* 添加mock */
function addMockRouter(router: Router, mock: Mock): void {
  for (const key in mock) {
    // 拆分，解析方法
    const formatData: string[] = key.split(/\s+/).filter((o: string): boolean => o !== '');
    let method: string = 'get';
    let uri: string = '';

    if (formatData.length === 0) continue;

    if (formatData.length === 1) {
      uri = formatData[0];
    } else {
      method = formatData[0].toLocaleLowerCase();
      uri = formatData[1];
    }

    // 判断router是否有该方法
    method = method in router ? method : 'get';

    const value: any | KoaFunc = mock[key];
    const routerFunc: KoaFunc = typeof value === 'function'
      ? value
      : (ctx: Context, next: Function): void => ctx.body = value;

    router[method](uri, routerFunc);
  }
}

/**
 * 本地mock数据
 * TODO: 本地mock数据无法清除缓存
 */
async function createMock(sweetOptions: SweetOptions, router: Router, isDevelopment: boolean): Promise<void> {
  try {
    const findFiles: Array<string> = defaultMockPath(sweetOptions.basicPath);

    if (sweetOptions.mockFile) {
      findFiles.unshift(sweetOptions.mockFile);
    }

    for (const findFile of findFiles) {
      if (await isFileExists(findFile)) {
        const mockModule: MockModule = await __require<MockModule>(findFile);

        if (isMockFunc(mockModule)) {
          const mock: Mock = await mockModule(sweetOptions);

          addMockRouter(router, mock);
        } else if (isMock(mockModule)) {
          addMockRouter(router, mockModule);
        }

        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default createMock;