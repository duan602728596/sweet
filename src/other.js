import { render } from 'react-dom';

render(
  <p>This is other page.</p>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept();
}