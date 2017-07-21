/**
 * Created by Aleksander on 2017-07-21.
 */
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');
const {ObjectID} = require('mongodb');

const id = "596f5ae5cbf9980c2484168b";

if (!ObjectID.isValid(id)) {
  console.log('your id is not valid');
}


// Todo.find({_id: id})
//   .then(todos => {
//     console.log('Todos:', todos);
//   });
//
// Todo.findOne({_id: id})
//   .then(todo => {
//     console.log('Todo:', todo);
//   });

// Todo.findById(id)
//   .then(doc => {
//     if (!doc) {
//       return console.log('Id not found');
//     }
//     console.log('Todo', doc);
//   })
//   .catch(err => {
//     // console.log('Error:', err);
//   });

User.findById(id)
  .then( user => {
    if (!user) {
      return console.log('User was not found');
    }
  })
  .catch( err => {
    console.log('There was an error');
    console.log(err);
  });