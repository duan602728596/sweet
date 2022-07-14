import * as path from 'node:path';
import * as fs from 'node:fs';
import * as process from 'node:process';
import _ from 'lodash';
import { requireModule } from '@sweet-milktea/utils';
import type { Argv } from '../utils/types.js';

async function argvUpdate(argv: Argv): Promise<void> {
  const update: Function = await requireModule('@sweet-milktea/util-tools/update');

  const { __DEV__, registry: argvRegistry, peerDependencies, __PACKAGES__ }: Argv = argv;
  const folders: Array<string> = []; // 目录列表

  if (_.isNil(__DEV__)) {
    folders.push(process.cwd());
  } else {
    const packages: string = path.join(process.cwd(), __PACKAGES__ ?? 'packages');
    const dirs: string[] = await fs.promises.readdir(packages);

    for (const dir of dirs) {
      const item: string = path.join(packages, dir);
      const stat: fs.Stats = await fs.promises.stat(item);
      const isDirectory: boolean = stat.isDirectory();

      if (isDirectory) folders.push(item);
    }
  }

  const registry: number = _.isNil(argvRegistry) ? 0 : argvRegistry;

  await update(folders, registry, peerDependencies ?? false);
}

export default argvUpdate;