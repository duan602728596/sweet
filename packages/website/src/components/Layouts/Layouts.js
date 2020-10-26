import PropTypes from 'prop-types';
import style from './layouts.sass';
import SlideMenu from '../SlideMenu/SlideMenu';

/* 网站布局 */
function Layouts(props) {
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