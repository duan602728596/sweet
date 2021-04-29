import type Koa from 'koa';
import { requireModule } from '../utils/utils';
import type { Log, SweetOptions } from '../utils/types';

/* 添加日志中间件 */
async function logs(app: Koa, log: Log, sweetOptions: SweetOptions): Promise<void> {
  const serverLog: Function = await requireModule('@sweet-milktea/server-log');

  const { accessLogger, logger }: {
    accessLogger: Function;
    logger: {
      error: Function;
    };
  } = serverLog(log.type, {
    pm2: log.pm2,
    url: log?.url,
    basicPath: sweetOptions.basicPath
  });

  app.use(accessLogger());

  app.on('error', (err: Error): void => {
    logger.error(err);
  });

}

export default logs;