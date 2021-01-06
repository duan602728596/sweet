import { useRoutes } from 'react-router-dom';
import Element from '../../components/Element/Element';
import MarkDown from '../../components/MarkDown/MarkDown';
import milkteaCli from '../../../../milktea-cli/README.md';
import milktea from '../../../../milktea/README.md';
import server from '../../../../server/README.md';
import serverLog from '../../../../server-log/README.md';
import utilTools from '../../../../util-tools/README.md';

/* /Packages 路由 */
function Index(props) {
  const routes = useRoutes([
    {
      path: 'Milktea',
      element: (
        <Element title="milktea">
          <MarkDown markdown={ milktea } />
        </Element>
      )
    },
    {
      path: 'MilkteaCli',
      element: (
        <Element title="milktea-cli">
          <MarkDown markdown={ milkteaCli } />
        </Element>
      )
    },
    {
      path: 'Server',
      element: (
        <Element title="server">
          <MarkDown markdown={ server } />
        </Element>
      )
    },
    {
      path: 'ServerLog',
      element: (
        <Element title="server-log">
          <MarkDown markdown={ serverLog } />
        </Element>
      )
    },
    {
      path: 'UtilTools',
      element: (
        <Element title="util-tools">
          <MarkDown markdown={ utilTools } />
        </Element>
      )
    }
  ]);

  return routes;
}

export default Index;