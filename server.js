'use strict';

// ** 1. Imports / Dependencies **
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import any helper modules or classes
const Forecast = require('./modules/Forecast'); 
const weatherData = require('./data/weather.json');

// ** 2. Configuration and Middleware **
const app = express(); // Initiate express
app.use(cors()); // Enable cross-origin requests

const PORT = process.env.PORT || 3001;

// ** 3. Routes **
app.get('/', (req, res) => {
  res.send('hello from the home route!');
});

app.get('/weather', (req, res) => {
  const { city_name, lat, lon } = req.query;

  // Validate query parameters
  const validationError = validateQueryParams(city_name, lat, lon);
  if (validationError) {
    return res.status(400).send(validationError);
  }

  // Find the city weather data
  const cityWeatherData = findCityWeatherData(city_name, lat, lon);
  if (cityWeatherData) {
    // Map forecast data and send response
    const forecastData = createForecastData(cityWeatherData.data);
    res.send(forecastData);
  } else {
    res.status(404).send('City weather data not found');
  }
});

// 404 - Not Found Route
app.get('*', (req, res) => {
  res.status(404).send('Not found');
});

// ** 4. Helper Functions ** 
const validateQueryParams = (cityName, lat, lon) => {
  if (!cityName || !lat || !lon) {
    return 'Missing required query parameters: cityName, lat, lon';
  }
  return null;
};

const findCityWeatherData = (cityName, lat, lon) => {
  const latitude = roundToThreeDecimals(parseFloat(lat));
  const longitude = roundToThreeDecimals(parseFloat(lon));

  return weatherData.find((city) => {
    return city.city_name.toLowerCase() === cityName.toLowerCase() &&
           roundToThreeDecimals(city.lat) === latitude &&
           roundToThreeDecimals(city.lon) === longitude;
  });
};

const createForecastData = (data) => {
  return data.map((day) => new Forecast(day.datetime, day.weather.description));
};

const roundToThreeDecimals = (num) => Math.round(num * 1000) / 1000;

// ** 5. Start Server ** 
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
