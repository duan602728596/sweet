export default function(ctx, sweetOptions) {
  return {
    title: 'Webpack App',
    initialState: {
      index: {
        likeLen: 32
      },
      list: {
        dataList: [
          { id: '3', name: '张飞' },
          { id: '4', name: '丁奉' },
          { id: '5', name: '张辽' }
        ]
      }
    }
  };
}