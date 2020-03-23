import { defineComponent, ref } from '@vue/composition-api';
import { Icon } from 'ant-design-vue';
import style from './index.sass';
import WelcomeSvgComponent from './images/welcome.component.svg';

export default defineComponent({
  setup: ({}, { root }) => {
    const { $store } = root;
    const stateLen = ref(0);

    return {
      stateLen,

      handleZanClick(event) {
        const likeLen = $store.getters['index/getLikeLen']();

        $store.dispatch('index/setLikeLen', likeLen + 1);
        stateLen.value++;
      }
    };
  },

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
          <span class={ style.len }>{ likeLen } & { this.stateLen }</span>
        </div>
        <img class={ style.img } src={ require('./images/1R5031O0-17.jpg').default } />
      </article>
    );
  }
});