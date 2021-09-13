import { createRoot } from 'react-dom';

const root = createRoot(document.getElementById('app'));

root.render(<p>This is other page.</p>);

if (module.hot) {
  module.hot.accept();
}