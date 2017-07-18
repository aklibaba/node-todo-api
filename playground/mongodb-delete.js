/**
 * Created by SAMSUNG on 15.07.2017.
 */
const {MongoClient, ObjectID} = require('mongodb');

const objId = new ObjectID();

console.log(objId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if ( err ) {
    return console.log(`Unable to connect to mongodb server: ${err}`);
  }
  console.log(`Connected to mongodb server`);
  
// db.collection('Todos').deleteMany({
//   text: "Something to do"
// }).then( res => {
//   console.log(JSON.stringify(res, undefined, 2));
// });
//
// db.collection('Todos').deleteOne({
// text: "Todo 2"
// }).then( res => {
//   console.log(JSON.stringify(res, undefined, 2));
// });
//
// db.collection('Todos').findOneAndDelete({
//   text: "Todo 3"
// }).then( res => {
//   console.log(JSON.stringify(res.value, undefined, 2));
// });

  db.collection('Users').findOneAndDelete({
    _id: ObjectID("596e0f4745956e24ac82ea04")
  }).then(res => {
    console.log(JSON.stringify(res, undefined, 2));
  });

  db.close();
});