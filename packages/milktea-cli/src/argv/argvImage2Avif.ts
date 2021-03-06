import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/utils';
import type { Argv } from '../utils/types';

/* image2avif命令 */
function argvImage2Avif(argv: Argv): void {
  const image2avif: Function = requireModule('@sweet-milktea/util-tools/image2avif');
  const cwd: string = process.cwd();
  const imageEntry: string = argv.imageEntry;
  const imageOutput: string = argv.imageOutput;

  image2avif(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput)
  );
}

export default argvImage2Avif;