import { configure } from '@storybook/react';
import theme from './theme';

function loadStories() {
  require('../docs/index');
}

configure(loadStories, module);