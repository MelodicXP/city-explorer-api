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

// Weather route
app.get('/weather', (request, response) => {
  const { city_name, lat, lon } = request.query;
  console.log('city_name from destructure: ', city_name);

  // Validate query parameters
  const validationError = validateQueryParams(city_name, lat, lon);
  if (validationError) {
    return response.status(400).send(validationError);
  }

  // Find the city weather data
  const cityWeatherData = findCityWeatherData(city_name, lat, lon);

  if (cityWeatherData) {
    // Map forecast data and send response
    const forecastData = createForecastData(cityWeatherData.data);
    response.send(forecastData);
  } else {
    response.status(404).send('City weather data not found');
  }
});

// Function to validate query parameters
const validateQueryParams = (cityName, lat, lon) => {
  if (!cityName || !lat || !lon) {
    return 'Missing required query parameters: cityName, lat, lon';
  }
  return null;
};

// Function to find the city weather data
const findCityWeatherData = (cityName, lat, lon) => {
  const latitude = roundToThreeDecimals(parseFloat(lat));
  const longitude = roundToThreeDecimals(parseFloat(lon));

  return weatherData.find((city) => {
    return city.city_name.toLowerCase() === cityName.toLowerCase() &&
           roundToThreeDecimals(city.lat) === latitude &&
           roundToThreeDecimals(city.lon) === longitude;
  });
};

// Function to map forecast data
const createForecastData = (data) => {
  return data.map((day) => new Forecast(day.datetime, day.weather.description));
};

// Utility function to round to 3 decimal places
const roundToThreeDecimals = (num) => Math.round(num * 1000) / 1000;

// Not found response
app.get('*', (request, response) => {
  response.status(404).send('not found');
});

// Error handling middleware must be the last app.use()
app.use((error, request, response) => {
  console.error(error);
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
