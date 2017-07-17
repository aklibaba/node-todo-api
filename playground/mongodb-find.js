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
  
  db.collection('Todos').find().count().then( count => {
    console.log(`Todos count ${count}`);
  }, err => {
    console.log(`Unable to fetch todos`, err);
  });
  
  db.collection('Users').find({
    name: "Alex"
  }).toArray().then(docs => {
    docs.forEach((doc, ind) => {
      console.log(`${ind + 1}) name: ${doc.name} is ${doc.age} years old`);
    })
  }, err => {
    console.log(`Unable to fetch users, error: ${err}`);
  });
  
  db.close();
});