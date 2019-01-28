import style from './style.sass';

/**
 * layout - Sider
 * 页面左侧菜单
 * 渲染二级和三级菜单
 */
export default {
  name: 'Sider',
  props: ['options'],
  methods: {
    optionsView(options: Array): Vue.VNode{
      return options.map((item: Object, index: number): Vue.VNode=>{
        if('children' in item && item.children.length > 0){
          return 1;
        }else{
          return 2;
        }
      });
    }
  },
  render(): Vue.VNode{
    return (
      <i-sider class={ style.sider } width="180">
        <i-menu width="180" default-active="">
          { this.optionsView(this.$props.options) }
        </i-menu>
      </i-sider>
    );
  }
};