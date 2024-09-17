const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

// Create a new user item
router.post('/', async (req, res) => {
  console.log('Received POST request to /user-items:', req.body);

  const { user_id, item_name, category_id, description } = req.body;

  try {
    // Log the query and values before executing
    console.log(`
      Executing query:
      INSERT INTO user_items (user_id, item_name, category_id, description) 
      VALUES (${user_id}, '${item_name}', ${category_id}, '${description}')
    `);

    // Proceed with adding the item
    const newItem = await pool.query(
      'INSERT INTO user_items (user_id, item_name, category_id, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [user_id, item_name, category_id, description]
    );

    console.log('New item inserted:', newItem.rows[0]); // Log the response

    res.json(newItem.rows[0]);
  } catch (err) {
    console.error('Error inserting user item:', err); // Detailed error logging
    res.status(500).json({ error: 'Server error, unable to add item' });
  }
});
  
// Get all user items
router.get('/', async (req, res) => {
  console.log('Received GET request to fetch all user items');
  const queryText = `
    SELECT user_items.*, categories.name AS category_name
    FROM user_items
    LEFT JOIN categories ON user_items.category_id = categories.id
  `;
  try {
    const result = await pool.query(queryText);
    console.log('Fetched all user items:', result.rows);
    res.status(200).json(result.rows); // Includes description
  } catch (err) {
    console.error('Error fetching user items:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get user items by user ID
router.get('/user/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  console.log(`Received GET request to fetch user items for user ID: ${user_id}`);
  const queryText = `
    SELECT user_items.*, categories.name AS category_name
    FROM user_items
    LEFT JOIN categories ON user_items.category_id = categories.id
    WHERE user_items.user_id = $1
  `;
  try {
    const result = await pool.query(queryText, [user_id]);
    console.log(`Fetched user items for user ID ${user_id}:`, result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(`Error fetching user items for user ID ${user_id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Update a user item by ID
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { item_name, category_id, description } = req.body; // Added description
  console.log(`Received PUT request to update user item ID: ${id}`, req.body);
  const queryText = `
    UPDATE user_items
    SET item_name = $1, category_id = $2, description = $3
    WHERE id = $4
    RETURNING *
  `;
  try {
    const result = await pool.query(queryText, [item_name, category_id, description, id]); // Include description
    console.log(`User item ID ${id} updated successfully:`, result.rows[0]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(`Error updating user item ID ${id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Delete a user item by ID
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  console.log(`Received DELETE request to delete user item ID: ${id}`);
  const queryText = `DELETE FROM user_items WHERE id = $1`;
  try {
    await pool.query(queryText, [id]);
    console.log(`User item ID ${id} deleted successfully`);
    res.status(204).end();
  } catch (err) {
    console.error(`Error deleting user item ID ${id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;