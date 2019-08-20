import { storiesOf } from '@storybook/react';
import React from 'react';
import MarkDown from './components/MarkDown/MarkDown';
import sweetIntroduction from './pages/introduction.md';
import sweetQuickStart from './pages/quick-start.md';
import milkteaCliReadme from '../packages/milktea-cli/README.md';
import milkteaReadme from '../packages/milktea/README.md';
import milkteaApi from './pages/milktea-api.md';
import serverReadme from '../packages/server/README.md';
import serverLogReadme from '../packages/server-log/README.md';
import utilToolsReadme from '../packages/util-tools/README.md';
import demo from './pages/demo.md';

storiesOf('sweet', module)
  .add('介绍', () => <MarkDown source={ sweetIntroduction } />)
  .add('快速开始', () => <MarkDown source={ sweetQuickStart } />);

storiesOf('packages', module)
  .add('milktea-cli', () => <MarkDown source={ milkteaCliReadme } />)
  .add('milktea(notes)', () => <MarkDown source={ milkteaReadme } />, { notes: { markdown: milkteaApi } });

storiesOf('packages/server', module)
  .add('server', () => <MarkDown source={ serverReadme } />)
  .add('server-log', () => <MarkDown source={ serverLogReadme } />);

storiesOf('packages', module)
  .add('util-tools', () => <MarkDown source={ utilToolsReadme } />);

storiesOf('demo', module)
  .add('demo', () => <MarkDown source={ demo } />);