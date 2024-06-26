import _ from 'lodash';
import connect from 'koa-connect';
import type Koa from 'koa';
import { createProxyMiddleware, type Options } from 'http-proxy-middleware';
import log4js, { type Logger } from 'log4js';
import { isFileExists } from '@sweet-milktea/utils';
import { defaultProxyPath, __require } from './utils.js';
import type { SweetOptions, LogLevel } from './types.js';

type ProxyConfig = { [key: string]: Options };
type ProxyConfigModule = ProxyConfig | ((sweetOptions: SweetOptions, app: Koa) => Promise<ProxyConfig>);

/* 添加代理中间件 */
function addMiddleware(app: Koa, proxyConfig: ProxyConfig, isDevelopment: boolean, env?: string): void {
  const logLevel: LogLevel = env === 'test' ? 'error' : (isDevelopment ? 'info' : 'error');
  const logger: Logger = log4js.getLogger();

  logger.level = logLevel;

  for (const key in proxyConfig) {
    const config: Options = proxyConfig[key];

    app.use(connect(
      createProxyMiddleware({
        pathFilter: key,
        changeOrigin: true,
        logger,
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
        const proxyModule: ProxyConfigModule = await __require<ProxyConfigModule>(findFile);

        if (_.isPlainObject(proxyModule)) {
          addMiddleware(app, proxyModule as ProxyConfig, isDevelopment, env);
        } else if (typeof proxyModule === 'function') {
          const proxyConfig: ProxyConfig = await proxyModule(sweetOptions, app);

          addMiddleware(app, proxyConfig, isDevelopment, env);
        }

        break;
      }
    }
  } catch (err) {
    console.error(err);
  }
}

export default createProxy;