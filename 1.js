try {
  console.log(
    require.resolve('imagemin-webpack-plugin')
  );
} catch (err) {
  console.log(null);
}