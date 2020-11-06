const request = require('supertest');
const bcrypt = require('bcrypt');
const { name, internet, lorem } = require('faker');
const { startServer, stopServer } = require('../../../../config');
const { User } = require('../../../../models/user');
const { Todo } = require('../../../../models/todo');

let app = null;
let payload = null;
let token = null;

function exec(code) {
  const requestBuilder = request(app).post('/api/v1/todos').send(payload);

  if (token) {
    requestBuilder.set('Authorization', `Bearer ${token}`);
  }

  return requestBuilder.expect(code);
}

async function seedDatabase() {
  const encryptedPassword = await bcrypt.hash('99994444', 12);

  const user = await User.create({
    name: name.findName(),
    email: internet.email(),
    password: encryptedPassword,
  });

  token = user.generateToken();
}

beforeEach(async () => {
  app = await startServer();
  await seedDatabase();
});

afterEach(async () => {
  await stopServer();
});

describe('POST /todos', () => {
  beforeEach(() => {
    payload = {
      title: name.title(),
      description: lorem.sentence(10),
    };
  });
  it('should return 401 if the user is not authenticated', async () => {
    token = null;

    const { body } = await exec(401);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/token/i);
  });
  it('should return 400 if the payload is invalid', async () => {
    payload.title = null;

    const { body } = await exec(400);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/title/i);
  });
  it('should return 201 and the todo if the payload and token are valid', async () => {
    const { body } = await exec(201);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('title');
    expect(body).toHaveProperty('description');

    const todo = await Todo.findById(body.id);
    expect(todo).toBeTruthy();
  });
});
