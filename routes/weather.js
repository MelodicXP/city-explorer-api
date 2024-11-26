'use strict';

const express = require('express');
const axios = require('axios');
const Forecast = require('../modules/Forecast');
const validateQueryParams = require('../helpers/queryValidation');

const weatherRouter = express.Router();
const weatherApiKey = process.env.WEATHER_API_KEY;

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

function createForecastData(data) {
  return data.map((day) => new Forecast(day.datetime, day.weather.description));
};

weatherRouter.get('/weather', getWeather);

module.exports = weatherRouter;

