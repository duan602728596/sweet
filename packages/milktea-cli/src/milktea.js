import process from 'process';

const isDevelopment: Object = process.env.NODE_ENV === 'development';

const milktea: Object = isDevelopment ? require('../../milktea/lib/milktea') : require('@sweet/milktea');

export default {
  milktea
};