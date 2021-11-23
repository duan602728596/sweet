import { defineComponent, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { LikeOutlined as IconLikeOutlined } from '@ant-design/icons-vue';
import style from './welcome.sass';
import WelcomeSvgComponent from './images/welcome.component.svg';

export default defineComponent({
  setup() {
    const store = useStore();
    const stateLen = ref(0);

    function handleZanClick(event) {
      const likeLen = store.getters['index/getLikeLen']();

      store.dispatch({
        type: 'index/setLikeLen',
        payload: likeLen + 1
      });
      stateLen.value++;
    }

    return {
      stateLen,
      likeLen: computed(store.getters['index/getLikeLen']),
      handleZanClick
    };
  },

  render(a) {
    const { stateLen, likeLen, handleZanClick } = a;

    return (
      <article>
        <h1>
          欢迎
          <WelcomeSvgComponent class={ style.welcome } />
        </h1>
        <p>如果你喜欢，你可以点个赞。</p>
        <div>
          <IconLikeOutlined class={ style.zan } role="button" aria-label="点赞" onClick={ handleZanClick } />
          <span class={ style.len }>{ likeLen } & { stateLen }</span>
        </div>
        <img class={ style.img } src={ require('./images/1R5031O0-17.jpg') } />
      </article>
    );
  }
});