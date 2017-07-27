/**
 * Created by Aleksander on 2017-07-18.
 */
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const app = express();


//Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });
  newTodo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400);
    res.send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos});
  }).catch(error => {
    res.status(400).send({error});
  })
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('The id you provided is not valid');
  }

  Todo.findById(id)
    .then(todo => {
      if (!todo) { //case: no resource found
        return res.status(404).send('Todo was not found');
      }
      res.send({todo}); //case: resource found
    })
    .catch(err => { //case: bad syntax
      res.status(400).send('There was an error. Please check the id you provided');
    });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  // if (!ObjectID.isValid(id)) {
  //   return res.status(400).send('The id you provided is not valid');
  // }

  Todo.findByIdAndRemove(id)
    .then(todo => {
      //case: no resource found
      if (!todo) {
        return res.status(404).send('Todo was not found');
      }
      res.send({
        deletedTodo: todo
      })
    })
    .catch(err => {
      res.status(400).send('There was an error, please check the id you provided')
    })
});

app.patch('/todos/:id', (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('The id you provided is not valid');
  }

  //if user sends a an object with completed property which is a boolean
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
      $set: body
    },
    {new: true})
    .then(todo => {
      if (!todo) {
        return res.status(404).send('No task with this id was found');
      }
      res.send({todo})
    })
    .catch(err => {
      res.status(400).send();
    })
});


module.exports = {app};