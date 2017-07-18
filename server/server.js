/**
 * Created by Aleksander on 2017-07-18.
 */
const app = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');