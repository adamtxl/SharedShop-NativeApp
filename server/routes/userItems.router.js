const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Create a new user item
router.post('/', (req, res) => {
  const { user_id, item_name, quantity } = req.body;
  const queryText = `INSERT INTO user_items (user_id, item_name, quantity) VALUES ($1, $2, $3) RETURNING *`;
  pool.query(queryText, [user_id, item_name, quantity])
    .then(result => res.status(201).json(result.rows[0]))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get all user items
router.get('/', (req, res) => {
  const queryText = `SELECT * FROM user_items`;
  pool.query(queryText)
    .then(result => res.status(200).json(result.rows))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Get user items by user ID
router.get('/user/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  const queryText = `SELECT * FROM user_items WHERE user_id = $1`;
  pool.query(queryText, [user_id])
    .then(result => res.status(200).json(result.rows))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Update a user item by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { item_name, quantity } = req.body;
  const queryText = `UPDATE user_items SET item_name = $1, quantity = $2 WHERE id = $3 RETURNING *`;
  pool.query(queryText, [item_name, quantity, id])
    .then(result => res.status(200).json(result.rows[0]))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Delete a user item by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  const queryText = `DELETE FROM user_items WHERE id = $1`;
  pool.query(queryText, [id])
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;