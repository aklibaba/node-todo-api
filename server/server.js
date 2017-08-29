/**
 * Created by Aleksander on 2017-07-18.
 */
require('./config/config');

const {authenticate} = require('./middleware/authenticate');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


const app = express();


//Local imports
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

const port = process.env.PORT;

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  const user = req.user;
  const newTodo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    _creator: user._id
  });
  newTodo.save().then(doc => {
    res.send(doc);
  }, e => {
    res.status(400);
    res.send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then(todos => {
    res.send({todos});
  }).catch(error => {
    res.status(400).send({error});
  })
});


app.post('/users', async (req, res) => {
  try {
    const body = _.pick(req.body, [ 'email', 'password' ]);
    const user = new User(body);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth', token).send(user)
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

//will require authentication in form f the token
app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});


/**
 * POST /users/login: Login Route
 * will be used by a user that doesn't have a token, so he cannot use the authenticate middleware
 */
app.post('/users/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.set('x-auth', token);
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e)
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.get('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const creator = req.user._id;

  if ( !ObjectID.isValid(id) ) {
    return res.status(400).send('The id you provided is not valid');
  }

  Todo.findOne({
    _id: id,
    _creator: creator
  })
      .then(todo => {
        if ( !todo ) { //case: no resource found
          return res.status(404).send('Todo was not found');
        }
        res.send({todo}); //case: resource found
      })
      .catch(err => { //case: bad syntax
        res.status(400).send('There was an error. Please check the id you provided');
      });
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const creatorId = req.user._id;

    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: creatorId
    });
    //case: no resource found
    if ( !todo ) {
      return res.status(404).send('Todo was not found');
    }
    res.send({
      deletedTodo: todo
    })

  } catch (err) {
    res.status(400).send('There was an error, please check the id you provided');
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, [ 'text', 'completed' ]);
  const userId = req.user._id;

  if ( !ObjectID.isValid(id) ) {
    return res.status(400).send('The id you provided is not valid');
  }

  //if user sends a an object with completed property which is a boolean
  if ( _.isBoolean(body.completed) && body.completed ) {
    body.completedAt = new Date().getTime();
  }
  else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
      _id: id,
      _creator: userId
    }, {
      $set: body
    },
    {new: true})
      .then(todo => {
        if ( !todo ) {
          return res.status(404).send('No task with this id was found');
        }
        res.send({todo})
      })
      .catch(err => {
        res.status(400).send();
      })
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});


module.exports = {app};
