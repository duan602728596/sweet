import _ from 'lodash';
import connect from 'koa-connect';
import type Koa from 'koa';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { requireCommonjsModule, isFileExists } from '@sweet-milktea/utils';
import { defaultProxyPath } from './utils';
import type { SweetOptions, LogLevel } from './types';

type ProxyConfig = { [key: string]: Options };

/* 添加代理中间件 */
function addMiddleware(app: Koa, proxyConfig: ProxyConfig, isDevelopment: boolean, env?: string): void {
  const logLevel: LogLevel | undefined = env === 'test' ? 'error' : (isDevelopment ? 'info' : 'error');

  for (const key in proxyConfig) {
    const config: Options = proxyConfig[key];

    app.use(connect(
      createProxyMiddleware(key, {
        changeOrigin: true,
        logLevel,
        ...config
      })
    ));
  }
}

/**
 * 本地代理
 * TODO: 本地代理无法清除缓存
 */
async function createProxy(sweetOptions: SweetOptions, app: Koa, isDevelopment: boolean, env?: string): Promise<void> {
  try {
    const findFiles: Array<string> = defaultProxyPath(sweetOptions.basicPath);

    if (sweetOptions.proxyFile) {
      findFiles.unshift(sweetOptions.proxyFile);
    }

    for (const findFile of findFiles) {
      if (await isFileExists(findFile)) {
        const module: any = await requireCommonjsModule(findFile);

        if (_.isPlainObject(module)) {
          await addMiddleware(app, module, isDevelopment, env);
        } else if (typeof module === 'function') {
          const proxyConfig: ProxyConfig = await module(sweetOptions, app);

          await addMiddleware(app, proxyConfig, isDevelopment, env);
        }

        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default createProxy;