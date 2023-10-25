'use strict';

const axios = require('axios');

// todo - deactivate weatherData and movieData when switch to live
// const weatherData = require('./data/weather.json'); // Import weather.json data into server

// todo - reactivate API_Keys when switch to live
const API_KEY = process.env.WEATHER_API_KEY;

// todo - Function (future reference) - getWeather - original try/catch code
// async function getWeather(request, expressResponse, next) {
//   try {
//     // todo - reactivate this section when switch to live
//     // Latitude and longitude queries from client
//     const latitude = request.query.lat;
//     const longitude = request.query.lon;

//     let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${API_KEY}&lat=${latitude}&lon=${longitude}`;

//     const axiosResponse = await axios.get(url);

//     let dailyForecastData = axiosResponse.data.data.map( (day) => new DailyForecast(day));

//     // todo - deactivate this section when switch to live
//     // Use local weather data while testing
//     // let dailyForecastData = weatherData.data.map( (day) => new DailyForecast(day));
//     // Work with static data to prevent multiple API requests while testing
//     // expressResponse.status(200).send(dailyForecastData);

//     // todo - reactivate when switch to live
//     expressResponse.status(200).send(dailyForecastData);

//   }
//   catch (error) {
//     const errorMessage = 'Internal Server Error, unable to show forecast';
//     next({ message: errorMessage });
//   }
// }


// Function - refactored using .then() - use commented out code above for future reference when testing
function getWeather(request, expressResponse, next) {

  const latitude = request.query.lat;
  const longitude = request.query.lon;
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${API_KEY}&lat=${latitude}&lon=${longitude}`;

  axios.get(url)

    .then(axiosResponse => axiosResponse.data.data.map( (day) => new DailyForecast(day)))
    .then(dailyForecastData => expressResponse.status(200).send(dailyForecastData))
    .catch(errorMessage => {
      errorMessage = 'Internal Server Error, unable to show forecast';
      next({ message: errorMessage });
    });
}

// Class - format weather data
class DailyForecast {

  constructor(obj){

    this.date = obj.datetime;
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`;

  }

}

module.exports = getWeather;
