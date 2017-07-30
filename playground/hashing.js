/**
 * Created by SAMSUNG on 30.07.2017.
 */
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
  id: 4
};

const token = jwt.sign(data, '123secret');
console.log(token);

const decoded = jwt.verify(token + '123', '123secret');
console.log(decoded);

// const message = 'I am some kind of message';
// const hashed = SHA256(message)
// .toString();
//
//
//
//
// const token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();
//
// const resultHash = SHA256(JSON.stringify(data) + 'somesecret').toString();
//
// console.log(`resultHash: ${resultHash}`);
// console.log(`token.hash: ${token.hash}`);
//
// if (resultHash === token.hash) {
//   console.log(`data was not manipulated`);
// } else {
//   console.log(`data was manipulated`);
// }