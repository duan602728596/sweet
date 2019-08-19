import { storiesOf } from '@storybook/react';
import React from 'react';
import MarkDown from './components/MarkDown/MarkDown';
import introduction from './pages/sweet/introduction.md';
import quickStart from './pages/sweet/quick-start.md';
import theme from '../.storybook/theme';

storiesOf('sweet', module)
  .addParameters({
    options: theme
  })
  .add('介绍', () => <MarkDown source={ introduction } />)
  .add('快速开始', () => <MarkDown source={ quickStart } />);