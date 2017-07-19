/**
 * Created by Aleksander on 2017-07-18.
 */
const app = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

const Todo = mongoose.model('Todo', new Schema({
  text: {
    type: String,
    required: true,
    // enum: ['buy', 'clean', 'paint'],
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  }
}));

const User = mongoose.model('Userios', new Schema({
  email: {
    type: String,
    required:true,
    minlength: 1,
    trim: true
  }
}));

const newUser = new User({
  email: 'alejandro.moloniewicz@gmail.com'
});

newUser.save().then( res => {
  console.log(res);
}, err => {
  console.log('Unable to save user', err);
});

const newTodo = new Todo({
  text: 'buy',
  completed: false
});

newTodo.save().then(res => {
  console.log('Save todo', res);
}, err => {
  console.log('Unable to save todo', err);
});

const buyGroceries = new Todo({
  text: "  buy Groceries  ",
  completed: true,
  completedAt: new Date('Apr 15 2017 19:00:00 EST')
});

buyGroceries.save().then(res => {
  console.log(`Saved todo: ${res}`);
}, err => {
  console.log(`Unable to sve todo: ${err}`);
});