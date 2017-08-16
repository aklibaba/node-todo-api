/**
 * Created by SAMSUNG on 27.07.2017.
 */
const env = process.env.NODE_ENV || 'development';
console.log(' env *****', env);
process.env.PORT = 3000;

if (env === 'development' || env === 'test') {
  const config = require('./config.json');
  const envConfig = config[env];

  Object.keys(envConfig).forEach( (key,i) => {
    process.env[key] = envConfig[key];
  })
}
