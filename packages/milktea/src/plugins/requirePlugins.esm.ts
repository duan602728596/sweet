import * as path from 'path';
import { requireModule } from '@sweet-milktea/utils';

const __dirname: string = path.dirname(
  decodeURIComponent(import.meta.url.replace(/^file:\/{2}/, '')));

/* 加载插件 */
function requirePlugins(id: string): Promise<any> {
  return requireModule(path.join(__dirname, id));
}

export default requirePlugins;