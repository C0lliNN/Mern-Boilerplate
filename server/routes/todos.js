const express = require('express');
const _ = require('lodash');
const mongoose = require('mongoose');
const authentication = require('../middlewares/authentication');
const { validateTodo, Todo } = require('../models/todo');

const router = express.Router();

router.use(authentication);

router.get('/', async (req, res) => {
  const todos = await Todo.find({ user: req.user.id });

  return res.send(todos);
});

router.post('/', async (req, res) => {
  const { value, error } = validateTodo(req.body);

  if (error) {
    return res.status(400).send({ message: error.message });
  }

  const todo = await Todo.create({
    ..._.pick(value, ['title', 'description']),
    user: req.user.id,
  });

  return res.status(201).send(todo);
});

router.patch('/:id/complete', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: 'Invalid ID' });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).send({ message: 'Todo not founded' });
  }

  if (todo.user.toString() !== req.user.id) {
    return res
      .status(403)
      .send({ message: 'You do not have permissions to this action.' });
  }

  todo.completed = true;
  await todo.save();

  return res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(404).send({ message: 'Invalid ID' });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).send({ message: 'Todo not founded' });
  }

  if (todo.user.toString() !== req.user.id) {
    return res
      .status(403)
      .send({ message: 'You do not have permissions to this action.' });
  }

  await todo.deleteOne();
  return res.sendStatus(200);
});

module.exports = router;
