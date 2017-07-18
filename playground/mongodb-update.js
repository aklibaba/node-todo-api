/**
 * Created by SAMSUNG on 15.07.2017.
 */
const {MongoClient, ObjectID} = require('mongodb');

const objId = new ObjectID();

console.log(objId);

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log(`Unable to connect to mongodb server: ${err}`);
  }
  console.log(`Connected to mongodb server`);

  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID("596e0f4745956e24ac82ea03")
  }, {
    $set: {
      text: "Todo Updated"
    }
  }, {
    returnOriginal: false
  }).then(updatedDoc => {
    console.log(JSON.stringify(updatedDoc, undefined, 2));
  });

  db.collection('Users').findOneAndUpdate({
    name: "Lukasz"
  }, {
    $set: {
      name: "Alex",
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then( res => {
    console.log(JSON.stringify(res, undefined, 2));
  });


  db.close();
});