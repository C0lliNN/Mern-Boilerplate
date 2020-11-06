const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');

const { User, validateUser } = require('../models/user');

function generatePayload(user) {
  return {
    ..._.pick(user, ['id', 'name', 'email']),
    token: user.generateToken(),
  };
}

const router = express.Router();

router.post('/signup', async (request, response) => {
  const { error, value } = validateUser(request.body);

  if (error) {
    return response.status(400).send({ message: error.message });
  }

  const existingUser = await User.findOne({ email: value.email });

  if (existingUser) {
    return response.status(422).send({ message: 'Email already in use' });
  }

  const newUser = new User();
  newUser.name = value.name;
  newUser.email = value.email;
  newUser.password = await bcrypt.hash(value.password, 12);
  await newUser.save();

  return response.status(201).send(generatePayload(newUser));
});

router.post('/login', async (request, response) => {
  const validator = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const { error, value } = validator.validate(request.body);

  if (error) {
    return response.status(400).send({ message: error.message });
  }

  const user = await User.findOne({ email: value.email });

  if (!user) {
    return response
      .status(422)
      .send({ message: 'There is no user for the given email' });
  }

  const validPassword = await bcrypt.compare(value.password, user.password);

  if (!validPassword) {
    return response.status(422).send({ message: 'Invalid Password' });
  }

  return response.send(generatePayload(user));
});

module.exports = router;
