'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');

const app = express(); // Initiate express

app.use(cors()); // enable cross origin from different sources

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.get('/weather', (request, response) => {
  let weatherDataArray = [];
  weatherDataArray.push(weatherData);
  console.log('Weather Data Array: ', weatherDataArray);

  let cityName = request.query.cityName;
  console.log('City Name from request: ', cityName);

  let latitude = parseFloat(request.query.lat);
  latitude = Math.round(latitude * 1000) / 1000;
  console.log('Latitude from request: ', latitude);

  let longitude = parseFloat(request.query.lon);
  longitude = Math.round(longitude * 1000) / 1000;
  console.log('Longitude from request: ', longitude);

  let cityWeatherData = weatherDataArray.filter((city) => {
    city.lat = Math.round(city.lat * 1000) / 1000;
    city.lon = Math.round(city.lon * 1000) / 1000;
    return city.city_name.toLowerCase() === cityName.toLowerCase() &&
           city.lat === latitude &&
           city.lon === longitude;
  });

  response.send(cityWeatherData[0]);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
