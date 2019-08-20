import { storiesOf } from '@storybook/react';
import React from 'react';
import MarkDown from './components/MarkDown/MarkDown';
import sweetIntroduction from './pages/sweet/introduction.md';
import sweetQuickStart from './pages/sweet/quick-start.md';
import milkteaIntroduction from './pages/packages/milktea/introduction.md';
import milkteaApi from './pages/packages/milktea/api.md';

storiesOf('sweet', module)
  .add('介绍', () => <MarkDown source={ sweetIntroduction } />)
  .add('快速开始', () => <MarkDown source={ sweetQuickStart } />);

storiesOf('packages/milktea', module)
  .add('介绍', () => <MarkDown source={ milkteaIntroduction } />)
  .add('api', () => <MarkDown source={ milkteaApi } />);