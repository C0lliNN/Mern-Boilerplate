const request = require('supertest');
const bcrypt = require('bcrypt');
const { lorem, name, internet} = require('faker');
const { startServer, stopServer } = require('../../../../config');
const { User } = require('../../../../models/user');
const { Todo } = require('../../../../models/todo');

let app = null;
let token = null;

function exec(code) {
  const requestBuilder = request(app).get('/api/v1/todos');

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

  const user2 = await User.create({
    name: name.findName(),
    email: internet.email(),
    password: encryptedPassword,
  });

  await Todo.create(
    {
      title: name.title(),
      description: lorem.sentence(30),
      user: user.id,
    },
    {
      title: name.title(),
      description: lorem.sentence(30),
      user: user.id,
    },
    {
      title: name.title(),
      description: lorem.sentence(30),
      user: user2.id,
    },
  );
}

beforeEach(async () => {
  app = await startServer();
  await seedDatabase();
});

afterEach(async () => {
  await stopServer();
});

describe('GET /todos', () => {
  it('should return 401 if the user is not authenticated', async () => {
    token = null;

    const { body } = await exec(401);

    expect(body).toHaveProperty('message');
    expect(body.message).toMatch(/token/i);
  });
  it('should return 200 and the todos created by the user', async () => {
    const { body } = await exec(200);

    expect(body).toHaveLength(2);
  });
});
