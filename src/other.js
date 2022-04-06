import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('app'));

root.render(<p>This is other page.</p>);

if (module.hot) {
  module.hot.accept();
}