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
  
  db.collection('Todos')
    .insertOne({
      text: "Todo 2",
      completed: true
    }, (err, res) => {
      if ( err ) {
        return console.log(`Unable to insert todo: ${err}`);
      }
      console.log(JSON.stringify(res, undefined, 2));

    });
  
  db.collection('Users')
    .insertOne({
      name: "Lukasz",
      age: 30,
      location: "Warsaw"
    }, (err, res) => {
      debugger;
      if ( err ) {
        return console.log(`Unable to insert, error: ${err}`);
      }
      console.log(JSON.stringify(res.ops[0]._id.getTimestamp(), undefined, 2));

    });
  
  db.close();
});