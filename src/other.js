import { createApp } from 'vue';

const app = createApp(
  <div class="app" id="app">
    <p>This is other page.</p>
  </div>
);

app.mount(document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}