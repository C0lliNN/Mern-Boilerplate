const request = require('supertest');
const bcrypt = require('bcrypt');
const { lorem, name, internet } = require('faker');
const { startServer, stopServer } = require('../../../../config');
const { User } = require('../../../../models/user');
const { Todo } = require('../../../../models/todo');

let app = null;
let todo1Id = null;
let todo2Id = null;
let id = null;
let token = null;

function exec(code) {
  const requestBuilder = request(app).delete(`/api/v1/todos/${id}`);

  if (token) {
    requestBuilder.set('Authorization', `Bearer ${token}`);
  }

  return requestBuilder.expect(code);
}

async function seedDatabase() {
  const encryptedPassword = await bcrypt.hash(internet.password(10), 12);

  const user = await User.create({
    name: name.findName(),
    email: internet.email(),
    password: encryptedPassword,
  });

  token = user.generateToken();

  const todo = await Todo.create({
    title: name.title(),
    description: lorem.sentence(30),
    user: user.id,
  });

  todo1Id = todo.id;

  const user2 = await User.create({
    name: name.findName(),
    email: internet.email(),
    password: encryptedPassword,
  });

  const todo2 = await Todo.create({
    title: name.title(),
    description: lorem.sentence(30),
    user: user2.id,
  });

  todo2Id = todo2.id;
}

beforeEach(async () => {
  app = await startServer();
  await seedDatabase();
});

afterEach(async () => {
  await stopServer();
});

describe('DELETE /todos/:id', () => {
  beforeEach(() => {
    id = todo1Id;
  });
  it('should return 401 if the user is not authenticated', async () => {
    token = null;

    const { body } = await exec(401);

    expect(body.message).toMatch(/token/i);
  });

  it('should return 404 if the todo is not founded', async () => {
    id = '5fa43a708727eb802ff20ccf';

    const { body } = await exec(404);

    expect(body.message).toMatch(/todo/i);
  });

  it('should return 404 if the id is not a valid objectId', async () => {
    id = '12345';

    const { body } = await exec(404);

    expect(body.message).toMatch(/id/i);
  });
  it('should return 403 if the given todo does not belong to the user', async () => {
    id = todo2Id;

    const { body } = await exec(403);

    expect(body.message).toMatch(/permission/i);
  });
  it('should return 200 if the data is valid', async () => {
    await exec(200);

    const todo = await Todo.findById(todo1Id);
    expect(todo).toBeFalsy();
  });
});
