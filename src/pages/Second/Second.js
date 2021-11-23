import { computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    return {
      pathname: computed(() => router.currentRoute.value.path)
    };
  },

  render(a) {
    const { pathname } = a;

    return (
      <div>
        <p>这是一个二级页。</p>
        <p>路由：{ pathname }</p>
      </div>
    );
  }
};