/**
 * Created by SAMSUNG on 27.07.2017.
 */
const env = process.env.NODE_ENV || 'development';
console.log(' env *****', env);
process.env.PORT = 3000;



if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}