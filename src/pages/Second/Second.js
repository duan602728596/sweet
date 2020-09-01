import routers from '../../router/routers';

export default {
  render() {
    const { path: pathname } = routers.currentRoute.value;

    return (
      <div>
        <p>这是一个二级页。</p>
        <p>
          路由：
          { pathname }
        </p>
      </div>
    );
  }
};