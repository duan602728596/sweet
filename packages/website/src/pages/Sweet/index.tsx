import type { ReactElement } from 'react';
import { useRoutes } from 'react-router';
import { Select } from 'antd';
import style from './index.sass';
import Element from '../../components/Element/Element';
import MarkDown from '../../components/MarkDown/MarkDown';
import introduction from '../../../../../README.md';
import quickStart from './quick-start.md';
import lernaJson from '../../../../../lerna.json' assert { type: 'json' };

const introductionText: string = introduction
  .replace('statics/logo.svg', 'https://raw.githubusercontent.com/duan602728596/sweet/master/statics/logo.svg')
  .replace('statics/tsl.jpg', 'https://raw.githubusercontent.com/duan602728596/sweet/master/statics/tsl.jpg')
  .replace(/<!--[\n\s]*(.|\n)*[\n\s]*-->/, '');

/* /Sweet 路由 */
function Index(props: {}): ReactElement | null {
  // 打开v1地址
  function handleOpenOldWebSite(value: string): void {
    window.open(`https://duan602728596.github.io/sweet/${ value }/#/Sweet/Introduction`);
  }

  const routes: ReactElement | null = useRoutes([
    {
      path: 'Introduction',
      element: (
        <Element title="介绍">
          <div className={ style.version }>
            <Select className={ style.versionSelect }
              size="small"
              defaultValue={ lernaJson.version }
              onSelect={ handleOpenOldWebSite }
            >
              <Select.Option value={ lernaJson.version }>{ lernaJson.version }</Select.Option>
              <Select.Option value="v3">v3</Select.Option>
              <Select.Option value="v2">v2</Select.Option>
              <Select.Option value="v1">v1</Select.Option>
            </Select>
          </div>
          <MarkDown markdown={ introductionText } />
        </Element>
      )
    },
    {
      path: 'QuickStart',
      element: (
        <Element title="快速开始">
          <MarkDown markdown={ quickStart } />
        </Element>
      )
    }
  ]);

  return routes;
}

export default Index;