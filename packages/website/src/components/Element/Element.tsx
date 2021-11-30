import { Fragment, type ReactElement, type ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

interface ElementProps {
  title: string;
  children: ReactNode;
}

/* 渲染组件和标题 */
function Element(props: ElementProps): ReactElement {
  const { title, children }: ElementProps = props;

  return (
    <Fragment>
      <Helmet>
        <title>{ title } - Sweet - 🍩一个webpack的通用配置解决方案</title>
      </Helmet>
      { children }
    </Fragment>
  );
}

Element.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default Element;