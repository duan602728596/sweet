import Vue from 'vue';
import Component from 'vue-class-component';
import { Icon } from 'ant-design-vue';
import style from './index.sass';
import WelcomeSvgComponent from './images/welcome.component.svg';

@Component
class Index extends Vue {
  // 点击事件
  handleZanClick(event) {
    const likeLen = this.$store.getters['index/getLikeLen']();

    this.$store.dispatch('index/setLikeLen', likeLen + 1);
  }

  render() {
    const likeLen = this.$store.getters['index/getLikeLen']();

    return (
      <article>
        <h1>
          欢迎
          <WelcomeSvgComponent class={ style.welcome } />
        </h1>
        <p>如果你喜欢，你可以点个赞。</p>
        <div>
          <Icon class={ style.zan } type="like" role="button" onClick={ this.handleZanClick } />
          <span class={ style.len }>{ likeLen }</span>
        </div>
        <img class={ style.img } src={ require('./images/1R5031O0-17.jpg') } />
      </article>
    );
  }
}

export default Index;