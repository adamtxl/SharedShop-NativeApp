const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 5001;
const cors = require('cors');
app.use(cors());
// Middleware Includes
const sessionMiddleware = require('./modules/session-middleware');
const passport = require('./strategies/user.strategy');

// Route Includes
const userRouter = require('./routes/user.router');
const shoppingListRouter = require('./routes/shoppingList.router');
const userItemRouter = require('./routes/userItems.router'); 
const categoryRouter = require('./routes/category.router');


// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('build'));

// Passport Session Configuration
app.use(sessionMiddleware);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/shopping-list', shoppingListRouter);
app.use('/api/user-items', userItemRouter);
app.use('/api/categories', categoryRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
