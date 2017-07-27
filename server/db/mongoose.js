/**
 * Created by Aleksander on 2017-07-20.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://aleks:123QWEasd@ds055905.mlab.com:55905/udemy-node-practice');
exports = {
  mongoose
};