import * as path from 'path';
import { requireModule } from '@sweet-milktea/utils';

/* 加载插件 */
function requirePlugins(id: string): Promise<any> {
  return requireModule(path.join(
    path.dirname(import.meta.url.replace(/^file:\/{2}/, '')),
    '../plugins',
    id)
  );
}

export default requirePlugins;