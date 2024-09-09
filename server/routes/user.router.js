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
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted


router.post('/login', (req, res, next) => {
  userStrategy.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send('Login failed');  // or customize this message
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.sendStatus(200);
    });
  })(req, res, next);
});

module.exports = router;

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', (req, res, next) => {
  userStrategy.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).send('Login failed');  // or customize this message
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.sendStatus(200);
    });
  })(req, res, next);
});

module.exports = router;
