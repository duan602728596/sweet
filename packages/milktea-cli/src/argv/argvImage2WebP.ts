/* image2webp命令 */
import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/utils';
import { Argv } from '../utils/types';

function argvImage2WebP(argv: Argv): void{
  const cwd: string = process.cwd();
  const image2webp: Function = requireModule('@sweet/util-tools/lib/image2webp');
  const imageEntry: string = argv.imageEntry;
  const imageOutput: string = argv.imageOutput;

  image2webp(
    path.join(cwd, imageEntry),
    path.join(cwd, imageOutput)
  );
}

export default argvImage2WebP;