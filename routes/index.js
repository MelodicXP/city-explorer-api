const express = require('express');
const weatherRouter = require('./weather');
const movieRouter = require('./movies');

const router = express.Router();

// Routes
router.use(weatherRouter);
router.use(movieRouter);

// Default route
router.get('/', (request, response) => {
  response.send('Hello from the home route!');
});

// Return route not found 404
router.use('*', (request, response) => {
  response.status(404).send('Not found');
});

module.exports = router;