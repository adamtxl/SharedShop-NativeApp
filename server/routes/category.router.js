const express = require('express');
const router = express.Router();
const pool = require('../modules/pool');

// GET /api/categories - Retrieve all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json(result.rows); // Send all categories to the front end
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error, unable to fetch categories" });
  }
});

module.exports = router;