import * as process from 'process';
import * as path from 'path';
import _ from 'lodash';
import { requireModule } from '../utils/moduleUtils';
import type { Argv } from '../utils/types';

/* media2webp命令 */
async function argvMedia2WebP(argv: Argv): Promise<void> {
  const image2webp: Function = await requireModule('@sweet-milktea/util-tools/image2webp');

  const { imageEntry, imageOutput, ext: argvExt }: Argv = argv;
  const cwd: string = process.cwd();
  const ext: string = argvExt ?? '';
  const extArr: string[] = _.without(ext.split(','), '');

  image2webp(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    true,
    extArr.length > 0 ? extArr : undefined
  );
}

export default argvMedia2WebP;