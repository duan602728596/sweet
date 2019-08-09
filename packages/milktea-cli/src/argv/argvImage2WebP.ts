import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/utils';
import { Argv } from '../utils/types';

/* image2webp命令 */
function argvImage2WebP(argv: Argv): void {
  const image2webp: Function = requireModule('@sweet-milktea/util-tools/image2webp');
  const cwd: string = process.cwd();
  const imageEntry: string = argv.imageEntry;
  const imageOutput: string = argv.imageOutput;
  const quality: number = argv.quality;

  image2webp(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    quality
  );
}

export default argvImage2WebP;