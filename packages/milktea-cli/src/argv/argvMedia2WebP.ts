import * as process from 'node:process';
import * as path from 'node:path';
import { requireModule } from '@sweet-milktea/utils';
import type { Argv } from '../utils/types';

/* media2webp命令 */
async function argvMedia2WebP(argv: Argv): Promise<void> {
  const image2webp: Function = await requireModule('@sweet-milktea/util-tools/media2webp');

  const { imageEntry, imageOutput, ext: argvExt }: Argv = argv;
  const cwd: string = process.cwd();
  const ext: string = argvExt ?? '';
  const extArr: string[] = ext.split(',').filter((o: string): boolean => o !== '');

  image2webp(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    true,
    extArr.length > 0 ? extArr : undefined
  );
}

export default argvMedia2WebP;