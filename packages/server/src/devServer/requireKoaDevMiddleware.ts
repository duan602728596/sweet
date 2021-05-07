import * as path from 'path';
import { requireModule } from '@sweet-milktea/utils';

/* 加载插件 */
function requireKoaDevMiddleware(id: string): any {
  return requireModule(path.join(__dirname, id));
}

export default requireKoaDevMiddleware;