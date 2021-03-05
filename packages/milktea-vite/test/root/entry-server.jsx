import { renderToString } from 'react-dom/server';

function render() {
  return renderToString(<div>Hello.</div>);
}

export default render;