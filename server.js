'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express(); // Initiate express
app.use(cors()); // Enable cross origin requests

const PORT = process.env.PORT || 3001;

// Class - Forecast
class Forecast {
  constructor(date, description) {
    this.date = date,
    this.description = description
  }
};

// Home route
app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

// Utility function to round to 3 decimal places
const roundToThreeDecimals = (num) => Math.round(num * 1000) / 1000;

// Route to handle weather data
app.get('/weather', (request, response) => {
  // Destructure query paramters
  let { cityName, lat, lon } = request.query;

  if (!cityName || !lat || !lon) {
    return response.status(400).send('Missing required query parameters: cityName, lat, lon');
  }

  // Parse and round latitude and longitude
  let latitude = roundToThreeDecimals(parseFloat(lat));
  let longitude = roundToThreeDecimals(parseFloat(lon));

  // Filter weather data
  let cityWeatherData = weatherData.find((city) => {
    return city.city_name.toLowerCase() === cityName.toLowerCase() &&
           roundToThreeDecimals(city.lat) === latitude &&
           roundToThreeDecimals(city.lon) === longitude;
  });

  // If match return city weather data
  if (cityWeatherData) {
    let forecastData = [];
    forecastData = cityWeatherData.data;

    forecastData = cityWeatherData.data.map((day) => {
      return new Forecast(day.datetime, day.weather.description);
    });
    response.send(forecastData);
  } else {
    response.status(404).send('City weather data not found');
  }
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
