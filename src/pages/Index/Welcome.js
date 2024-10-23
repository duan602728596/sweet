import { defineComponent, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { LikeOutlined as IconLikeOutlined } from '@ant-design/icons-vue';
import useIndexStore from './modules/useIndexStore';
import style from './welcome.sass';
import WelcomeSvgComponent from './images/welcome.component.svg';

export default defineComponent({
  setup() {
    const indexStore = useIndexStore(),
      { likeLen } = storeToRefs(indexStore),
      { setLikeLen } = indexStore;

    const stateLen = ref(0);

    function handleZanClick(event) {
      setLikeLen(likeLen.value + 1);
      stateLen.value = stateLen.value + 1;
    }

    return {
      stateLen,
      likeLen,
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