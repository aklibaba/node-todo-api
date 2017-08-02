/**
 * Created by Aleksander on 2017-07-20.
 */
const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {todos, users, populateUsers, populateTodo,} = require('./seed/seed');


beforeEach(populateTodo);
beforeEach(populateUsers);


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
      .expect(res => {
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
      .expect(res => {
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

describe('DELETE /todos/:id', () => {

  const testId = todos[0]['_id'];

  it('should remove a todo', done => {
    request(app)
      .delete(`/todos/${testId}`)
      .expect(200)
      .expect(res => {
        expect(res.body.deletedTodo._id).toBe(String(testId));
        expect(res.body.deletedTodo.text).toBe(todos[0]['text']);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        Todo.findById(testId)
          .then(todo => {
            expect(todo).toNotExist('does not exist');
            done();
          })
          .catch(err => done(err));
      });
  });

  it('should return 404 if todo not found', done => {
    request(app)
      .delete(`/todos/5975cc9c055e5d633d0c99fd`)
      .expect(404)
      .end(done);
  });

  it('should return 400 if id not valid', done => {
    request(app)
      .delete('/todos/123')
      .expect(400)
      .end(done);
  });


});

describe('PATCH /todos/:id', () => {
  const testId1 = todos[0]['_id'];
  const testId2 = todos[1]['_id'];
  const testText = "I just updated";

  it('should update the todo', done => {
    request(app)
      .patch(`/todos/${testId1}`)
      .send({
        text: testText,
        completed: true
      })
      .expect(200)
      .expect(res => {
        expect(res.body.todo.text).toBe(testText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('string');
      })
      .end(done);
  });

  it('should clear completed at when todo is not completed', done => {
    request(app)
      .patch(`/todos/${testId2}`)
      .expect(200)
      .expect(res => {
        expect(res.body.todo.completedAt).toNotExist();
        expect(res.body.todo.completed).toNotExist();
      })
      .end(done);
  });

});