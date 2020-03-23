import * as Router from '@koa/router';
import * as _ from 'lodash';
import { defaultMockPath, deleteCacheAndRequireModule, requireModule, isExists } from './utils';
import { SweetOptions, ServerContext } from './types';

type KoaFunc = (ctx: ServerContext, next: Function) => void | Promise<void>;
type Mock = { [key: string]: any | KoaFunc };
type MockFunc = (sweetOptions: SweetOptions) => Mock | Promise<Mock>;
type MockModule = Mock | MockFunc;

function isMock(mockModule: MockModule): mockModule is Mock {
  return _.isPlainObject(mockModule);
}

function isMockFunc(mockModule: MockModule): mockModule is MockFunc {
  return typeof mockModule === 'function';
}

/* 添加mock */
function addMockRouter(router: Router, mock: Mock): void {
  for (const key in mock) {
    // 拆分，解析方法
    const formatData: string[] = _.without(key.split(/\s+/), '');
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
      : (ctx: ServerContext, next: Function): void => ctx.body = value;

    router[method](uri, routerFunc);
  }
}

/**
 * 本地mock数据
 * TODO: 本地mock数据无法清除缓存
 */
async function createMock(sweetOptions: SweetOptions, router: Router, isDevelopment: boolean): Promise<void> {
  try {
    const defaultMock: { ts: string; tsx: string; js: string } = defaultMockPath(sweetOptions.basicPath);
    const findFiles: Array<string> = [defaultMock.ts, defaultMock.tsx, defaultMock.js];

    if (sweetOptions.mockFile) {
      findFiles.unshift(sweetOptions.mockFile);
    }

    for (const findFile of findFiles) {
      if (await isExists(findFile)) {
        const mockModule: MockModule = isDevelopment
          ? deleteCacheAndRequireModule(findFile)
          : requireModule(findFile);

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