import { storiesOf, addParameters } from '@storybook/react';
import React from 'react';
import MarkDown from './components/MarkDown/MarkDown';
import sweetIntroduction from './pages/introduction.md';
import sweetQuickStart from './pages/quick-start.md';
import milkteaCliReadme from '@sweet-milktea/milktea-cli/README.md';
import milkteaReadme from '@sweet-milktea/milktea/README.md';
import serverReadme from '@sweet-milktea/server/README.md';
import serverLogReadme from '@sweet-milktea/server-log/README.md';
import utilToolsReadme from '@sweet-milktea/util-tools/README.md';
import demo from './pages/demo.md';

addParameters({
  options: {
    theme: {
      brandTitle: 'Sweet - 🍩一个webpack的通用配置解决方案',
      brandUrl: 'https://github.com/duan602728596/sweet'
    }
  }
});

storiesOf('sweet', module)
  .add('介绍', () => <MarkDown source={ sweetIntroduction } />)
  .add('快速开始', () => <MarkDown source={ sweetQuickStart } />);

storiesOf('packages', module)
  .add('milktea-cli', () => <MarkDown source={ milkteaCliReadme } />)
  .add('milktea', () => <MarkDown source={ milkteaReadme } />);

storiesOf('packages/server', module)
  .add('server', () => <MarkDown source={ serverReadme } />)
  .add('server-log', () => <MarkDown source={ serverLogReadme } />);

storiesOf('packages', module)
  .add('util-tools', () => <MarkDown source={ utilToolsReadme } />);

storiesOf('demo', module)
  .add('demo', () => <MarkDown source={ demo } />);