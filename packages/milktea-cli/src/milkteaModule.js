import process from 'process';

const isDevelopment: Object = process.env.NODE_ENV === 'development';

const milkteaModule: Object = isDevelopment ? require('../../milktea/lib/milktea') : require('@sweet/milktea');
const devServer: Function = isDevelopment ? require('../../server/lib/devServer') : require('@sweet/server/lib/devServer');
const proServer: Function = isDevelopment ? require('../../server/lib/proServer') : require('@sweet/server/lib/proServer');

export default {
  milktea: milkteaModule,
  devServer,
  proServer
};