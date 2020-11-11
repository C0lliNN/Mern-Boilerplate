const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const MIN_TITLE_LENGTH = 5;
const MAX_TITLE_LENGTH = 100;

const MIN_DESCRIPTION_LENGTH = 5;
const MAX_DESCRIPTION_LENGTH = 255;

const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: MIN_TITLE_LENGTH,
    max: MAX_TITLE_LENGTH,
  },
  description: {
    type: String,
    min: MIN_DESCRIPTION_LENGTH,
    max: MAX_DESCRIPTION_LENGTH,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
});

const Todo = mongoose.model('todos', todoSchema);

function validateTodo(data) {
  const validator = Joi.object({
    title: Joi.string().required().min(MIN_TITLE_LENGTH).max(MAX_TITLE_LENGTH),
    description: Joi.string()
      .allow('')
      .min(MIN_DESCRIPTION_LENGTH)
      .max(MAX_DESCRIPTION_LENGTH),
    completed: Joi.boolean(),
  });

  return validator.validate(data);
}

module.exports = { Todo, validateTodo };
