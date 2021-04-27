import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/moduleUtils';
import type { Argv } from '../utils/types';

/* imageCompression命令 */
async function imageCompress(argv: Argv): Promise<void> {
  const image2webp: Function = await requireModule('@sweet-milktea/util-tools/imageCompress');

  const { imageEntry, imageOutput }: Argv = argv;
  const cwd: string = process.cwd();

  image2webp(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput)
  );
}

export default imageCompress;