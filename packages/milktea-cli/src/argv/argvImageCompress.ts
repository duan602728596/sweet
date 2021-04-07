import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

/* imageCompression命令 */
function imageCompress(argv: Argv): void {
  const image2webp: Function = requireModule('@sweet-milktea/util-tools/imageCompress');

  const cwd: string = process.cwd();
  const imageEntry: string = argv.imageEntry;
  const imageOutput: string = argv.imageOutput;

  image2webp(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput)
  );
}

export default imageCompress;