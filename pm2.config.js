module.exports = {
  apps: [
    {
      name: 'app',
      script: 'npm',
      args: 'run server',
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log'
    }
  ]
};