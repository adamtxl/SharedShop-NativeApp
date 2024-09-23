const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();


router.post('/', (req, res) => {
    const { user_id, list_name } = req.body;
    const queryText = `INSERT INTO shopping_lists (user_id, list_name) VALUES ($1, $2) RETURNING *`;
    pool.query(queryText, [user_id, list_name])
      .then(result => res.status(201).json(result.rows[0]))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  
// POST route to add items to a specific shopping list

  router.post('/:list_id/add-items', (req, res) => {
    const { list_id } = req.params;
    const { items } = req.body; // Array of item objects with id and quantity
  
    const queryText = `INSERT INTO shopping_list_items (list_id, item_id, quantity) VALUES ($1, $2, $3)`;
  
    // Insert all items into shopping_list_items table
    const promises = items.map(item => pool.query(queryText, [list_id, item.id, item.quantity]));
  
    Promise.all(promises)
      .then(() => res.status(200).json({ success: true }))
      .catch(err => res.status(500).json({ error: err.message }));
  });
  

router.get('/', (req, res) => {
    const queryText = `SELECT * FROM shopping_lists`;
    pool.query(queryText)
      .then(result => res.status(200).json(result.rows))
      .catch(err => res.status(500).json({ error: err.message }));
  });

  // GET route to get all shopping lists for a specific user
  router.get('/user/:user_id', (req, res) => {
    const { user_id } = req.params;
    const queryText = `SELECT * FROM shopping_lists WHERE user_id = $1`;
    pool.query(queryText, [user_id])
      .then(result => res.status(200).json(result.rows))
      .catch(err => res.status(500).json({ error: err.message }));
  });

  // GET route to get a specific shopping list by id
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const queryText = `SELECT * FROM shopping_lists WHERE id = $1`;
    pool.query(queryText, [id])
      .then(result => {
        if (result.rows.length === 0) {
          res.status(404).json({ error: 'List not found' });
        } else {
          res.status(200).json(result.rows[0]);
        }
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });

    // PUT route to update a shopping list by id
    router.put('/:id', (req, res) => {
        const { id } = req.params;
        const { list_name } = req.body;
        const queryText = `UPDATE shopping_lists SET list_name = $1 WHERE id = $2 RETURNING *`;
        pool.query(queryText, [list_name, id])
          .then(result => {
            if (result.rows.length === 0) {
              res.status(404).json({ error: 'List not found' });
            } else {
              res.status(200).json(result.rows[0]);
            }
          })
          .catch(err => res.status(500).json({ error: err.message }));
      });

      
      // DELETE route to delete a shopping list by id
      router.delete('/:id', (req, res) => {
        const { id } = req.params;
        const queryText = `DELETE FROM shopping_lists WHERE id = $1 RETURNING *`;
        pool.query(queryText, [id])
          .then(result => {
            if (result.rows.length === 0) {
              res.status(404).json({ error: 'List not found' });
            } else {
              res.status(200).json(result.rows[0]);
            }
          })
          .catch(err => res.status(500).json({ error: err.message }));
      });
      
      module.exports = router;
