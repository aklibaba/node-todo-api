/**
 * Created by Aleksander on 2017-08-02.
 */
const {Todo} = require('../../models/todo');
const {User} = require('../../models/user');
const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken');

const user1Id = new ObjectId();
const user2Id = new ObjectId();
const users = [
  {
    _id: user1Id,
    email: 'alex@dp.js',
    password: 'onePass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: user1Id, access: 'auth'}, 'abc123').toString()
      }
    ]
  },
  {
    _id: user2Id,
    email: 'piotr@ws.com',
    password: 'twoPass',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({_id: user2Id, access: 'auth'}, 'abc123').toString()
      }
    ]

  }
];

const populateUsers = function (done) {
  User.remove({})
    .then(() => {
      const user1 = new User(users[0]).save();
      const user2 = new User(users[1]).save();

      return Promise.all([user1, user2]).then(() => {
        done()
      });

    })
};

const todos = [
  {text: "First Todo", _id: new ObjectId(), _creator: user1Id},
  {text: "Second todo", _id: new ObjectId(), completed: true, completedAt: 33, _creator: user2Id}
];


const populateTodo = function (done) {
  Todo.remove({}) //remove all docs in todos collection
    .then(() => {
      return Todo.insertMany(todos) //insert new todos to the todos collection
    })
    .then(() => {
      Todo.find({}).then(todos => {
        console.log(`Fetched todos are: ${todos}`);
        done();
      }).catch(error => {
        done(err)
      });
    }); //call done to indicate that the async operations have finished

};

module.exports = {
  todos,
  users,
  populateUsers,
  populateTodo,
};