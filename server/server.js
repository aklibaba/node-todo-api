/**
 * Created by Aleksander on 2017-07-18.
 */
const express = require('express');
const bodyParser = require('body-parser');

//Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  const newTodo = new Todo({
    text: req.body.text,
    completed: req.body.completed
  });
  newTodo.save().then(doc => {
    console.log('Saved:', doc);
    res.send(doc);
  }, e => {
    res.status(400);
    res.send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then(todos => {
    res.send({todos});
  }).catch( error => {
    res.status(400).send({error});
  })
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(400).send('The id you provided is not valid');
  }

  Todo.findById(id)
    .then( todo => {
    if (!todo) { //case: no resource found
      return res.status(404).send('Todo was not found');
    }
      res.send({todo}); //case: resource found
  })
    .catch( err => { //case: bad syntax
      res.status(400).send('There was an error. Please check the id you provided');
    });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = {app};