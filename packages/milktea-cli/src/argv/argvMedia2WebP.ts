import * as process from 'process';
import * as path from 'path';
import * as _ from 'lodash';
import { requireModule } from '../utils/utils';
import { Argv } from '../utils/types';

/* media2webp命令 */
function argvMedia2WebP(argv: Argv): void {
  const image2webp: Function = requireModule('@sweet-milktea/util-tools/image2webp');
  const cwd: string = process.cwd();
  const imageEntry: string = argv.imageEntry;
  const imageOutput: string = argv.imageOutput;
  const ext: string = argv.ext ?? '';
  const extArr: string[] = _.without(ext.split(','), '');

  image2webp(
    path.isAbsolute(imageEntry) ? imageEntry : path.join(cwd, imageEntry),
    path.isAbsolute(imageOutput) ? imageOutput : path.join(cwd, imageOutput),
    true,
    extArr.length > 0 ? extArr : undefined
  );
}

export default argvMedia2WebP;