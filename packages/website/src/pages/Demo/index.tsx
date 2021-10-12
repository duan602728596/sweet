import type { ReactElement } from 'react';
import Element from '../../components/Element/Element';
import MarkDown from '../../components/MarkDown/MarkDown';
import demo from './demo.md';

/* /Demo 路由 */
function Index(props: {}): ReactElement {
  return (
    <Element title="Demo">
      <MarkDown markdown={ demo } />
    </Element>
  );
}

export default Index;