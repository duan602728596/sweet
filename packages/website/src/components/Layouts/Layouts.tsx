import type { ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import style from './layouts.sass';
import SlideMenu from '../SlideMenu/SlideMenu';

interface LayoutsProps {
  children: ReactNode;
}

/* 网站布局 */
function Layouts(props: LayoutsProps): ReactElement {
  return (
    <div className={ style.main }>
      <div className={ style.slide }>
        <SlideMenu />
      </div>
      <div className={ style.routerView }>
        { props.children }
      </div>
    </div>
  );
}

Layouts.propTypes = {
  children: PropTypes.node
};

export default Layouts;