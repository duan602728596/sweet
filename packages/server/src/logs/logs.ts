import * as Koa from 'koa';
import { requireModule } from '../utils/utils';
import { Log, SweetOptions } from '../utils/types';

/* 添加日志中间件 */
function logs(app: Koa, log: Log, sweetOptions: SweetOptions): void {
  const serverLog: Function = requireModule('@sweet/server-log');
  const { accessLogger, logger }: {
    accessLogger: Function;
    logger: {
      error: Function;
    };
  } = serverLog(log.type, log.options);

  app.use(accessLogger());

  app.on('error', (err: Error): void => {
    logger.error(err);
  });

}

export default logs;