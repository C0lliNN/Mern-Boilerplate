const express = require('express');
const users = require('./users');
const todos = require('./todos');
const error = require('../middlewares/error');

const router = express.Router();

router.use(express.json());
router.use('/api/v1', users);
router.use('/api/v1/todos', todos);
router.use(error);

module.exports = router;
