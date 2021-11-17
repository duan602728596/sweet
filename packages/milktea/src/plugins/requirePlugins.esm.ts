import * as path from 'path';
import { requireModule, metaHelper } from '@sweet-milktea/utils';

const { __dirname }: { __filename: string; __dirname: string } = metaHelper(import.meta.url);

/* 加载插件 */
function requirePlugins<T = unknown>(id: string): Promise<T> {
  return requireModule(path.join(__dirname, id));
}

export default requirePlugins;