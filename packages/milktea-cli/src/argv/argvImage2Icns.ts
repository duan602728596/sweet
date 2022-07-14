import * as process from 'node:process';
import * as path from 'node:path';
import { requireModule } from '@sweet-milktea/utils';
import type { Argv } from '../utils/types.js';

/* image2icns命令 */
async function argvImage2Icns(argv: Argv): Promise<void> {
  const image2icns: Function = await requireModule('@sweet-milktea/util-tools/image2icns');

  const { imageEntry, imageOutput, size, retina }: Argv = argv;
  const cwd: string = process.cwd();

  image2icns(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    { size, retina }
  );
}

export default argvImage2Icns;