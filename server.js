'use strict';

require('dotenv').config(); // Allows for use of environment variables
const express = require('express'); // Framework to manage server and gives functionality to create routes for API
const cors = require('cors'); // Security for requestes, controlled access to resources
const getWeather = require('./modules/weather');
const getMovies = require('./modules/movies');
const app = express(); // Initialize express
const PORT = process.env.PORT || 3002; // Use port from .env file

app.use(cors()); // Use express with cors


// Initial default route to ensure connection is working fine (do this first)
app.get('/', (request, response, next) => {

  // Message to send back, connection OK
  response.status(200).send('Default Route Working');

});


// API call to Weatherbit
app.get('/weather', getWeather);


// API call to movieDB
app.get('/movies', getMovies);


// Error handler, inboked any time 'throw new Error' encountered in code
app.use( (error, request, response, next) => {

  // response.status(500).send(error.message);
  console.error(error); // Log the error to the server console for debugging
  response.status(500).json({ error: error.message }); // Send a JSON response with a 500 status and an error message

});


app.listen(PORT, () => console.log(`listening on ${PORT}`));
