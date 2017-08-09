/**
 * Created by Aleksander on 2017-07-20.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const todo = exports;

todo.Todo = mongoose.model('Todo', new Schema({
  text: {
    type: String,
    required: true,
    // enum: ['buy', 'clean', 'painat'],
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
  },
  _creator: {
    required: true,
    type: mongoose.Schema.Types.ObjectId
  }
}));
