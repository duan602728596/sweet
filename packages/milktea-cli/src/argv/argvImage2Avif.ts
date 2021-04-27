import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/moduleUtils';
import type { Argv } from '../utils/types';

/* image2avif命令 */
async function argvImage2Avif(argv: Argv): Promise<void> {
  const image2avif: Function = await requireModule('@sweet-milktea/util-tools/image2avif');

  const { imageEntry, imageOutput }: Argv = argv;
  const cwd: string = process.cwd();

  image2avif(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput)
  );
}

export default argvImage2Avif;