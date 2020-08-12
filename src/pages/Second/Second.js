import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

/* state */
const state = createStructuredSelector({
  data: createSelector(
    ({ second: $$second }) => $$second?.get?.('second')?.get?.('data'),
    (data) => data ?? 0
  )
});

/* 二级页 */
function Second(props) {
  const { data } = useSelector(state);
  const location = useLocation();

  return (
    <div>
      <p>这是一个二级页。</p>
      <p>
        路由：
        { location.pathname }
      </p>
      <p>
        redux：
        { data }
      </p>
    </div>
  );
}

export default Second;