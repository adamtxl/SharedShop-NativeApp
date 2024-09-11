const express = require('express');
const {
  rejectUnauthenticated,
} = require('../modules/authentication-middleware');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool');
const userStrategy = require('../strategies/user.strategy');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', rejectUnauthenticated, (req, res) => {
  // Send back user object from the session (previously queried from the database)
  res.send(req.user);
});

// Handles POST request with new user data
router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = encryptLib.encryptPassword(req.body.password);
  const email = req.body.email;

  const queryText = `INSERT INTO "user" (username, password, email) VALUES ($1, $2, $3) RETURNING id`;
  pool.query(queryText, [username, password, email])
    .then(() => res.sendStatus(201))
    .catch((err) => {
      console.log('User registration failed: ', err);
      res.sendStatus(500);
    });
});

// Handles login form authenticate/login POST
router.post('/login', (req, res, next) => {
  userStrategy.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send('Login failed');  // Customize this message if needed
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      // Send user details back in the response
      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        }
      });
    });
  })(req, res, next);
});

module.exports = router;