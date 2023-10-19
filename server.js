'use strict';


// Require dontenv, express, cors, and weather.json
require('dotenv').config(); // Allows for use of environment variables
const express = require('express'); // Framework to manage server and gives functionality to create routes for API
const cors = require('cors'); // Security for requestes, controlled access to resources

// todo - reactivate axios when switch to live
// const axios = require('axios');

// todo - deactivate weatherData when switch to live
const weatherData = require('./data/weather.json'); // Import weather.json data into server


const app = express(); // Initialize express
app.use(cors()); // Use express with cors

// todo - reactivate API_Key when switch to live
// const API_KEY = process.env.WEATHER_API_KEY;

const PORT = process.env.PORT || 3002; // Use port from .env file


// Initial default route to ensure connection is working fine (do this first)
app.get('/', (request, response, next) => {

  // Message to send back, connection OK
  response.status(200).send('Default Route Working');

});


// API call to Weatherbit
app.get('/weather', async (request, expressResponse, next) => {

  try {
    // todo - reactivate this section when switch to live
    // Latitude and longitude queries from client
    // const latitude = request.query.lat;
    // const longitude = request.query.lon;

    // let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${API_KEY}&lat=${latitude}&lon=${longitude}`;

    // const axiosResponse = await axios.get(url);

    // let dailyForecastData = axiosResponse.data.data.map( (day) => new DailyForecast(day));

    // todo - deactivate this section when switch to live
    // Use local data while testing
    let dailyForecastData = weatherData.data.map( (day) => new DailyForecast(day));
    // Work with static data to prevent multiple API requests while testing
    expressResponse.status(200).send(dailyForecastData);

    // todo - reactivate when switch to live
    // expressResponse.status(200).send(dailyForecastData);

  }
  catch (error) {
    next(error);
  }

});


// Create class for Forecast objects, objects will hold date and description of city data weather
class DailyForecast {

  constructor(obj){

    this.date = obj.datetime;
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`;

  }

}


// Error handler, inboked any time 'throw new Error' encountered in code
app.use( (error, request, response, next) => {

  // response.status(500).send(error.message);
  console.error(error); // Log the error to the server console for debugging
  response.status(500).json({ error: 'Internal Server Error, Cannot Display Forecast' }); // Send a JSON response with a 500 status and an error message

});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
