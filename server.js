'use strict';

// ** 1. Imports / Dependencies **
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const cors = require('cors');

// Import any env
const PORT = process.env.PORT || 3001;
const weatherApiKey = process.env.WEATHER_API_KEY;

// Import any helper modules or classes
const Forecast = require('./modules/Forecast'); 
const weatherData = require('./data/weather.json');

// ** 2. Configuration and Middleware **
const app = express(); // Initiate express
app.use(cors()); // Enable cross-origin requests

// ** 3. Routes **
app.get('/', getDefaultRoute);
app.get('/weather', getWeather);
app.get('*', getNotFound); // 404 - Return route not found
app.use('*', handleError); // 500 - Return server side error

// ** 4. Route Handlers **
function getDefaultRoute(request, response) {
  response.send('hello from the home route!');
};

async function getWeather(request, response, next) {
  const { city_name, lat, lon } = request.query; // Destructure from request query

  // Validate query parameters
  const validationError = validateQueryParams(city_name, lat, lon);
  if (validationError) {
    return response.status(400).send(validationError);
  }

  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${weatherApiKey}&lat=${lat}&lon=${lon}`;
  
  try {
    const weatherResponse = await axios.get(url);
    const forecastData = createForecastData(weatherResponse.data.data)
    response.send(forecastData);
  } catch (error) {
    console.error('Error fetching weather data', error);
    next(error);
  }
};

function getNotFound(request, response) {
  response.status(404).send('Not found');
}

function handleError(error, request, response, next) {
  response.status(500).send(`Something went wrong. ${error.message}`);
};

// ** 5. Helper Functions **
function validateQueryParams(cityName, lat, lon) {
  if (!cityName || !lat || !lon) {
    return 'Missing required query parameters: cityName, lat, lon';
  }

  return null;
};

function findCityWeatherData(cityName, lat, lon) {
  const latitude = roundToThreeDecimals(parseFloat(lat));
  const longitude = roundToThreeDecimals(parseFloat(lon));

  return weatherData.find((city) => {
    return city.city_name.toLowerCase() === cityName.toLowerCase() &&
           roundToThreeDecimals(city.lat) === latitude &&
           roundToThreeDecimals(city.lon) === longitude;
  });
};

function createForecastData(data) {
  return data.map((day) => new Forecast(day.datetime, day.weather.description));
};

function roundToThreeDecimals(num) {
  return Math.round(num * 1000) / 1000;
}

function startServer() {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`));  
};

// ** 5. Start Server ** 
startServer();
