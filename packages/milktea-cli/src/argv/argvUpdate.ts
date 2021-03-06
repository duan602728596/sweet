import * as path from 'path';
import * as fs from 'fs';
import * as process from 'process';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

async function argvUpdate(argv: Argv): Promise<void> {
  const update: Function = requireModule('@sweet-milktea/util-tools/update');
  const folders: Array<string> = [];

  if (_.isNil(argv.__DEV__)) {
    folders.push(process.cwd());
  } else {
    const packages: string = path.join(process.cwd(), argv?.__PACKAGES__ ?? 'packages');
    const dirs: string[] = await fs.promises.readdir(packages);

    for (const dir of dirs) {
      const item: string = path.join(packages, dir);
      const stat: fs.Stats = await fs.promises.stat(item);
      const isDirectory: boolean = stat.isDirectory();

      if (isDirectory) folders.push(item);
    }
  }

  const registry: number = _.isNil(argv.registry) ? 0 : argv.registry;

  await update(folders, registry, argv?.peerDependencies ?? false);
}

export default argvUpdate;