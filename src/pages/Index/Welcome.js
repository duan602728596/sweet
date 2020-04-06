import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { Typography } from 'antd';
import { LikeFilled as IconLikeFilled } from '@ant-design/icons';
import style from './welcome.sass';
import { setLikeLen } from './models/models';
import welcome, { ReactComponent as WelcomeSvgComponent } from './images/welcome.svg';

/* state */
const state = createStructuredSelector({
  likeLen: createSelector(
    ({ index: $$index }) => $$index.get?.('likeLen'),
    (data) => data
  )
});

function Welcome(props) {
  const { likeLen } = useSelector(state);
  const dispatch = useDispatch();

  // 点赞
  function handleZanClick(event) {
    (likeLen + 1) |> setLikeLen |> dispatch;
  }

  return (
    <Typography>
      <Typography.Title>
        欢迎
        <WelcomeSvgComponent className={ style.welcome } />
      </Typography.Title>
      <Typography.Paragraph>
        如果你喜欢，你可以点个赞。
      </Typography.Paragraph>
      <div>
        <IconLikeFilled className={ style.zan } role="button" onClick={ handleZanClick } />
        <span className={ style.len }>{ likeLen }</span>
      </div>
      <img className={ style.img } src={ require('./images/1R5031O0-17.jpg').default } />
    </Typography>
  );
}

export default Welcome;