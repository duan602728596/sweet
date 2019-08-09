import * as process from 'process';
import * as path from 'path';
import { requireModule } from '../utils/utils';
import { Argv } from '../utils/types';

/* image2icns命令 */
function argvImage2Icns(argv: Argv): void {
  const image2icns: Function = requireModule('@sweet-milktea/util-tools/image2icns');
  const cwd: string = process.cwd();
  const imageEntry: string = argv.imageEntry;
  const imageOutput: string = argv.imageOutput;
  const size: number = argv.size;
  const retina: number = argv.retina;

  image2icns(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    { size, retina }
  );
}

export default argvImage2Icns;