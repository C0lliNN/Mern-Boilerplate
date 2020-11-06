const request = require('supertest');
const bcrypt = require('bcrypt');
const { name, internet } = require('faker');
const { startServer, stopServer } = require('../../../../config');
const { User } = require('../../../../models/user');

let app = null;
let payload = null;

function exec(code) {
  return request(app).post('/api/v1/signup').send(payload).expect(code);
}

async function seedDatabase() {
  const encryptedPassword = await bcrypt.hash('99994444', 12);

  await User.create({
    name: name.findName(),
    email: 'test@test.com',
    password: encryptedPassword,
  });
}

beforeEach(async () => {
  app = await startServer();
  await seedDatabase();
});

afterEach(async () => {
  await stopServer();
});

describe('POST /signup', () => {
  beforeEach(() => {
    payload = {
      name: name.findName(),
      email: internet.email(),
      password: internet.password(10),
    };
  });
  it('should return 400 and a message if payload is invalid', async () => {
    payload.name = null;

    const { body } = await exec(400);
    expect(body.message).toBeTruthy();
  });
  it('should return 422 and a message if email is already in user', async () => {
    payload.email = 'test@test.com';

    const { body } = await exec(422);
    expect(body.message).toMatch(/email/i);
  });
  it('should return 201 and the newly created user if payload is valid ', async () => {
    const { body } = await exec(201);

    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('name');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('token');

    const user = await User.findById(body.id);

    expect(user).toBeTruthy();
  });
});
