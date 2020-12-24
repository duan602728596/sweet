import { Observer } from 'mobx-react';
import { Typography } from 'antd';
import { LikeFilled as IconLikeFilled } from '@ant-design/icons';
import style from './welcome.sass';
import indexStore from './models/index';
import welcome, { ReactComponent as WelcomeSvgComponent } from './images/welcome.svg';

function Welcome(props) {
  // 点赞
  function handleZanClick(event) {
    indexStore.setLikeLen(indexStore.likeLen + 1);
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
        <span className={ style.len }>
          <Observer>{ () => indexStore.likeLen }</Observer>
        </span>
      </div>
      <img className={ style.img } src={ require('./images/1R5031O0-17.jpg').default } />
    </Typography>
  );
}

export default Welcome;