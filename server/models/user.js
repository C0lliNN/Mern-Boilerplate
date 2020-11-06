const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const MIN_NAME_LENGTH = 3;
const MAX_NAME_LENGTH = 40;

const MIN_EMAIL_LENGTH = 8;
const MAX_EMAIL_LENGTH = 255;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 64;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: MIN_NAME_LENGTH,
    max: MAX_NAME_LENGTH,
  },
  email: {
    type: String,
    required: true,
    min: MIN_EMAIL_LENGTH,
    max: MAX_EMAIL_LENGTH,
  },
  password: {
    type: String,
    required: true,
    min: MIN_PASSWORD_LENGTH,
    max: MAX_PASSWORD_LENGTH,
  },
});

userSchema.methods.generateToken = function generateToken() {
  return jwt.sign(
    {
      id: this.id,
      name: this.name,
      email: this.email,
    },
    process.env.JWT_KEY,
  );
};

const User = mongoose.model('users', userSchema);

function validateUser(data) {
  const validator = Joi.object({
    name: Joi.string().required().min(MIN_NAME_LENGTH).max(MAX_NAME_LENGTH),
    email: Joi.string()
      .required()
      .email()
      .min(MIN_EMAIL_LENGTH)
      .max(MAX_EMAIL_LENGTH),
    password: Joi.string()
      .required()
      .min(MIN_PASSWORD_LENGTH)
      .max(MAX_PASSWORD_LENGTH),
  });

  return validator.validate(data);
}

module.exports = { User, validateUser };
