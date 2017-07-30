/**
 * Created by Aleksander on 2017-07-20.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "{VALUE} is not a valid email"
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [ {
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  } ]
});


const User = mongoose.model('User', UserSchema);

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    access,
    _id: user._id.toHexString()
  }, 'abc123').toString();
  
  user.tokens.push({
    access,
    token
  });
  
  user.save()
      .then()
};

module.exports = {
  User
};
