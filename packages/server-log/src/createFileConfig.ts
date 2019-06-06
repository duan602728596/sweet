import * as path from 'path';

/**
 * 创建本地文件日志的配置
 * @param { string } basicPath: 基础路径
 * @param { boolean } pm2: 是否启动pm2
 */
function createFileConfig(basicPath: string, pm2: boolean): object {
  const dir: string = path.join(basicPath, '.sweet/logs');

  return {
    appenders: {
      access: {
        type: 'dateFile',
        filename: path.join(dir, 'access'),
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      },
      application: {
        type: 'dateFile',
        filename: path.join(dir, 'application'),
        pattern: 'yyyy-MM-dd.log',
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