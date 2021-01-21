import { useRoutes } from 'react-router-dom';
import Element from '../../components/Element/Element';
import MarkDown from '../../components/MarkDown/MarkDown';
import introduction from '../../../../../README.md';
import quickStart from './quick-start.md';

const introductionText = introduction
  .replace('statics/logo.svg', 'https://raw.githubusercontent.com/duan602728596/sweet/master/statics/logo.svg')
  .replace('statics/tsl.jpg', 'https://raw.githubusercontent.com/duan602728596/sweet/master/statics/tsl.jpg');

/* /Sweet 路由 */
function Index(props) {
  const routes = useRoutes([
    {
      path: 'Introduction',
      element: (
        <Element title="介绍">
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