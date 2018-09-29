import path from 'path';
import process from 'process';

const isDevelopment: boolean = process.env.NODE_ENV === 'development';

export default {
  frame: 'react',
  dll: ['react'],
  entry: {
    app: [path.join(__dirname, 'src/app.js')]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: isDevelopment ? '[name].js' : '[name].build.js'
  }
};