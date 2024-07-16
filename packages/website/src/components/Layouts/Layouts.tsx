import type { ReactElement, PropsWithChildren } from 'react';
import style from './layouts.sass';
import SlideMenu from '../SlideMenu/SlideMenu';

/* 网站布局 */
function Layouts(props: PropsWithChildren): ReactElement {
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

export default Layouts;