import envWindow from './asyncModule/window';
import envNode from './asyncModule/node';

let module = null;

if (typeof window === 'object') {
  module = envWindow;
} else {
  module = envNode;
}

export default module;