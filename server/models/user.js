/**
 * Created by Aleksander on 2017-07-20.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = mongoose.model('Userios', new Schema({
  email: {
    type: String,
    required:true,
    minlength: 1,
    trim: true
  }
}));

module.exports = {
  User
};
