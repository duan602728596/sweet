import { useRoutes } from 'react-router-dom';
import { Select } from 'antd';
import style from './index.sass';
import Element from '../../components/Element/Element';
import MarkDown from '../../components/MarkDown/MarkDown';
import introduction from '../../../../../README.md';
import quickStart from './quick-start.md';
import lernaJson from '../../../../../lerna.json';

const introductionText = introduction
  .replace('statics/logo.svg', 'https://raw.githubusercontent.com/duan602728596/sweet/master/statics/logo.svg')
  .replace('statics/tsl.jpg', 'https://raw.githubusercontent.com/duan602728596/sweet/master/statics/tsl.jpg');

/* /Sweet 路由 */
function Index(props) {
  // 打开v1地址
  function handleOpenOldWebSite(value) {
    if (value === 'v1') {
      window.open('https://duan602728596.github.io/sweet/v1/#/Sweet/Introduction');
    }
  }

  const routes = useRoutes([
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