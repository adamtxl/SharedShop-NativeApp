const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Create a new user item
router.post('/', async (req, res) => {
    const { user_id, item_name, category_id, quantity, shopping_list_id } = req.body;
    console.log('Received POST request to create user item:', req.body);
  
    const client = await pool.connect();
  
    try {
      await client.query('BEGIN');
  
      // Insert into user_items table
      const insertUserItemQuery = `
        INSERT INTO user_items (user_id, item_name, category_id)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const userItemResult = await client.query(insertUserItemQuery, [user_id, item_name, category_id]);
      const userItemId = userItemResult.rows[0].id;
  
      // Insert into list_items table
      const insertListItemQuery = `
        INSERT INTO list_items (shopping_list_id, user_item_id, quantity)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const listItemResult = await client.query(insertListItemQuery, [shopping_list_id, userItemId, quantity]);
  
      await client.query('COMMIT');
  
      console.log('User item created successfully:', listItemResult.rows[0]);
      res.status(201).json(listItemResult.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error creating user item:', err.message);
      res.status(500).json({ error: err.message });
    } finally {
      client.release();
    }
  });
  
// Get all user items
router.get('/', (req, res) => {
  console.log('Received GET request to fetch all user items');
  const queryText = `SELECT * FROM user_items`;
  pool.query(queryText)
    .then(result => {
      console.log('Fetched all user items:', result.rows);
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error('Error fetching user items:', err.message);
      res.status(500).json({ error: err.message });
    });
});

// Get user items by user ID
router.get('/user/:user_id', (req, res) => {
  const user_id = req.params.user_id;
  console.log(`Received GET request to fetch user items for user ID: ${user_id}`);
  const queryText = `SELECT * FROM user_items WHERE user_id = $1`;
  pool.query(queryText, [user_id])
    .then(result => {
      console.log(`Fetched user items for user ID ${user_id}:`, result.rows);
      res.status(200).json(result.rows);
    })
    .catch(err => {
      console.error(`Error fetching user items for user ID ${user_id}:`, err.message);
      res.status(500).json({ error: err.message });
    });
});

// Update a user item by ID
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const { item_name, quantity } = req.body;
  console.log(`Received PUT request to update user item ID: ${id}`, req.body);
  const queryText = `UPDATE user_items SET item_name = $1, quantity = $2 WHERE id = $3 RETURNING *`;
  pool.query(queryText, [item_name, quantity, id])
    .then(result => {
      console.log(`User item ID ${id} updated successfully:`, result.rows[0]);
      res.status(200).json(result.rows[0]);
    })
    .catch(err => {
      console.error(`Error updating user item ID ${id}:`, err.message);
      res.status(500).json({ error: err.message });
    });
});

// Delete a user item by ID
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  console.log(`Received DELETE request to delete user item ID: ${id}`);
  const queryText = `DELETE FROM user_items WHERE id = $1`;
  pool.query(queryText, [id])
    .then(() => {
      console.log(`User item ID ${id} deleted successfully`);
      res.status(204).end();
    })
    .catch(err => {
      console.error(`Error deleting user item ID ${id}:`, err.message);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;