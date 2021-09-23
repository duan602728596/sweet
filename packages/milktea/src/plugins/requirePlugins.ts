import * as path from 'path';
import { requireModule } from '@sweet-milktea/utils';

/* 加载插件 */
function requirePlugins<T = unknown>(id: string): Promise<T> {
  return requireModule(path.join(__dirname, id));
}

export default requirePlugins;