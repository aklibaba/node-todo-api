/**
 * Created by Aleksander on 2017-07-21.
 */
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

const id = "596f5ae5cbf9980c2484168b";

// if (!ObjectID.isValid(id)) {
//   console.log('your id is not valid');
// }

Todo.remove({}).then( res => {
  console.log(res);
});

Todo.findOneAndRemove({}).then( doc => {
  console.log(doc);
});

Todo.findByIdAndRemove(id).then( doc => {
  console.log(doc);
});