import { useLocation } from 'react-router-dom';

/* 二级页 */
function Second(props) {
  const location = useLocation();

  return (
    <div>
      <p>这是一个二级页。</p>
      <p>
        路由：
        { location.pathname }
      </p>
    </div>
  );
}

export default Second;