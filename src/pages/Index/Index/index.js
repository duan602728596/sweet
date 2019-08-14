import React from 'react';
import { bindActionCreators } from 'redux';
import { useSelector } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import useActions from '../../../store/useActions';
import { Typography, Icon } from 'antd';
import style from './index.sass';
import { setLikeLen } from '../reducer/reducer';

/* state */
const state = createStructuredSelector({
  likeLen: createSelector(
    ($$state) => $$state.get('index').get('likeLen'),
    (data) => data
  )
});

/* actions */
const actions = (dispatch) => ({
  action: bindActionCreators({
    setLikeLen
  }, dispatch)
});

function Index(props) {
  const { likeLen } = useSelector(state);
  const { action } = useActions(actions);

  // 点赞
  function handleZanClick(event) {
    action.setLikeLen(likeLen + 1);
  }

  return (
    <Typography>
      <Typography.Title>欢迎</Typography.Title>
      <Typography.Paragraph>
        如果你喜欢，你可以点个赞。
      </Typography.Paragraph>
      <div>
        <Icon className={ style.zan } type="like" role="button" onClick={ handleZanClick } />
        <span className={ style.len }>{ likeLen }</span>
      </div>
    </Typography>
  );
}

export default Index;