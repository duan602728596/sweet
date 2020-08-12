import { configure } from '@storybook/react';

function loadStories() {
  require('./docs/index');
}

configure(loadStories, module);