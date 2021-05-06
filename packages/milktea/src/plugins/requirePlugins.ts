import * as path from 'path';
import { requireModule } from '@sweet-milktea/utils';

/* 加载插件 */
function requirePlugins(id: string): Promise<any> {
  return requireModule(path.join(__dirname, id));
}

export default requirePlugins;