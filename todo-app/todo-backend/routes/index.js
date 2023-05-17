const express = require('express');
const router = express.Router();

const configs = require('../util/config')
const redis = require('../redis') // Tehtävä 12.9
const { getAsync, setAsync } = require('../redis')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

// Tehtävä 12.10
router.get('/statistics', async (_, res) => {
  const addedTodos = await getAsync('added_todos')
  res.json({ added_todos: addedTodos || 0 })
})

module.exports = router;
