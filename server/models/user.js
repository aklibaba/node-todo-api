/**
 * Created by Aleksander on 2017-07-20.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({_id: user._id.toHexString(), access}, 'process.env.JWT_SECRET').toString();
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  })

};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { //pull from token array any object that has token === token
        token: token
      }
    }
  });

};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'process.env.JWT_SECRET');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    })
  } else {
    next();
  }
});

UserSchema.statics.findByCredentials = function (email, password) {

  return User.findOne({email})
    .then(user => {
      if (!user) { //user does not exist
        return Promise.reject();
      }

      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            return reject();
          }
          else if (!match) {
            return reject();
          }
          resolve(user);
        });
      });
    });
};


const User = mongoose.model('User', UserSchema);

module.exports = {
  User
};
