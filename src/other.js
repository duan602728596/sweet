import Vue from 'vue';

const index = new Vue({
  el: '#app',
  render() {
    return (
      <div class="app" id="app">
        <p>This is other page.</p>
      </div>
    );
  }
});

if (module.hot) {
  module.hot.accept();
}