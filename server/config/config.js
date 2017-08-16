/**
 * Created by SAMSUNG on 27.07.2017.
 */
const env = process.env.NODE_ENV || 'development';
console.log(' env *****', env);

if ( env === 'development' || env === 'test' ) {
  process.env.PORT = 3000;
  const config = require('./config.json');
  const envConfig = config[ env ];

  Object.keys(envConfig).forEach(key => {
    process.env[ key ] = envConfig[ key ];
  })
}
