const express = require('express');
const path = require('path');
const cors = require('cors');
const users = require('./users');
const todos = require('./todos');
const error = require('../middlewares/error');

const router = express.Router();

if (process.env.NODE_ENV !== 'production') {
  router.use(cors());
}

router.use(express.json());
router.use('/api/v1', users);
router.use('/api/v1/todos', todos);

if (process.env.NODE_ENV === 'production') {
  router.use(express.static('../client/build'));

  router.get('*', (req, res) => {
    res.sendFile(
      path.resolve(__dirname, '../../client', 'build', 'index.html'),
    );
  });
}

router.use(error);

module.exports = router;
