/**
 * Created by Aleksander on 2017-07-20.
 */
const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const {ObjectId} = require('mongodb');

const todos = [
  {text: "First Todo", _id: new ObjectId()},
  {text: "Second todo", _id: new ObjectId()}
];


beforeEach((done) => {
  Todo.remove({}) //remove all docs in todos collection
    .then(() => {
    return Todo.insertMany(todos) //insert new todos to the todos collection
  })
    .then(() => done()); //call done to indicate that the async operations have finished
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    const text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then(todos => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch(e => done(e))
      })
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then(todos => {
          expect(todos.length).toBe(2);
          done();
        }).catch(e => done(e));

      })
  })
});

describe('GET /todos', () => {

  it('should get all todos', done => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect( res => {
        expect(res.body.todos.length).toBe(2);
      })
      .end(done)
  })

});

describe('GET /todos:id', () => {

  const testId = todos[0]['_id'];

  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${testId}`)
      .expect(200)
      .expect( res => {
        expect(res.body.todo._id).toBe(String(testId));
        expect(res.body.todo.text).toBe('First Todo');
      })
      .end(done)

  });

  it('should return a 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectId()}`)
      .expect(404)
      .end(done);
  });

  it('should return a 400 if id has incorrect syntax', (done) => {

    request(app)
      .get('/todos/123')
      .expect(400)
      .end(done)
  });


});