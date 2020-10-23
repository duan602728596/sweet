import { useRoutes } from 'react-router-dom';
import Element from '../../components/Element/Element';
import MarkDown from '../../components/MarkDown/MarkDown';
import introduction from './introduction.md';
import quickStart from './quick-start.md';

/* /Sweet 路由 */
function Index(props) {
  const routes = useRoutes([
    {
      path: 'Introduction',
      element: (
        <Element title="介绍">
          <MarkDown markdown={ introduction } />
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