import * as process from 'node:process';
import * as path from 'node:path';
import { requireModule } from '@sweet-milktea/utils';
import type { Argv } from '../utils/types';

/* image2avif命令 */
async function argvImage2Avif(argv: Argv): Promise<void> {
  const image2avif: Function = await requireModule('@sweet-milktea/util-tools/image2avif');

  const { imageEntry, imageOutput, converter }: Argv = argv;
  const cwd: string = process.cwd();

  image2avif(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    converter === 'avifenc' ? 'avifenc' : 'sharp'
  );
}

export default argvImage2Avif;