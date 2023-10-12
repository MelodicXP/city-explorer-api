'use strict';


// Require dontenv, express, cors, and weather.json
require('dotenv').config(); // Allows for use of environment variables
const express = require('express'); // Framework to manage server and gives functionality to create routes for API
const cors = require('cors'); // Security for requestes, controlled access to resources
const weatherData = require('./data/weather.json'); // Import weather.json data into server


const app = express(); // Initialize express

app.use(cors()); // Use express with cors

const PORT = process.env.PORT || 3002; // Use port from .env file


// Function to create a Forecast object
function createForecast(data) {

  // Capture high and low temp
  let hiTemp = data.high_temp;
  let lowTemp = data.low_temp;

  // Assign properties to each forecast object created
  let forecast = {

    description: `Low of ${lowTemp}, high of ${hiTemp} with ${data.weather.description.toLowerCase()}`,
    date: data.datetime,

  };
  return new Forecast(forecast);
}

// Ensure default route connection is working first
app.get('/', (request, response, next) => {

  // Message to send back, connection OK
  response.status(200).send('Default Route Working');

});


app.get('/weather', (request, response, next) => {

  try {
    // Establish queries
    const searchQuery = request.query.city_name;
    const latitude = parseFloat(request.query.lat); // Convert to number type
    const longitude = parseFloat(request.query.lon); // Convert to number type

    // Assign data of city if queries match data of any city in database
    let cityData = weatherData.find( (city) => {

      // Check if queries match data of a city, if so return true
      return (
        city.city_name === searchQuery &&
        parseFloat(city.lat) === latitude &&
        parseFloat(city.lon) === longitude
      );

    });

    // If no matching city data was found, throw an error
    if (!cityData) {
      throw new Error('City data not found');
    }

    // Extract the daily weather data and create Forecast objects
    const dailyData = cityData.data;
    const forecasts = dailyData.map((dayData) => createForecast(dayData));

    // Return data of matching city based on query
    response.status(200).send(forecasts);

  }
  catch (error) {
    next(error);
  }

});

// Create class for Forecast objects, objects will hold date and description of city data weather
class Forecast {

  constructor(obj){

    this.date = obj.date;
    this.description = obj.description;

  }

}

// Error handler, inboked any time 'throw new Error' encountered in code
app.use( (error, request, response, next) => {

  response.status(500).send(error.message);

});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
