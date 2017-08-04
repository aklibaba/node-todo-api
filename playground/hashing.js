/**
 * Created by Aleksander on 2017-08-01.
 */
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123QWEasd!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashedPassword = '$2a$10$ctfJB6t/8M0ROzOhXcGCK.sD85t5P55aYoYXNcoZmas/oIanlkN5O';

bcrypt.compare('assd', hashedPassword, (err, res) => {
  console.log(`Result is ${res}`);
});
