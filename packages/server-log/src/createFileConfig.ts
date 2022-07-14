import * as path from 'node:path';
import { logsCache, accessCache, applicationCache, logs } from './cacheConfig';

/**
 * 创建本地文件日志的配置
 * @param { string } basicPath: 基础路径
 * @param { boolean } pm2: 是否启动pm2
 */
function createFileConfig(basicPath: string, pm2: boolean): object {
  const dir: string = path.join(basicPath, logsCache);

  return {
    appenders: {
      access: {
        type: 'dateFile',
        filename: path.join(dir, accessCache),
        pattern: logs,
        alwaysIncludePattern: true
      },
      application: {
        type: 'dateFile',
        filename: path.join(dir, applicationCache),
        pattern: logs,
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: {
        appenders: ['access'],
        level: 'info'
      },
      application: {
        appenders: ['application'],
        level: 'warn'
      },
      access: {
        appenders: ['access'],
        level: 'info'
      }
    },
    pm2
  };
}

export default createFileConfig;