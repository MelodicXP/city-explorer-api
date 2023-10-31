'use strict';

// todo - reactivate axios when switch to live
const axios = require('axios');
const cache = require('./cache');

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
  const twentyFourHoursInMs = 86400000;
  const key = `city ${latitude} ${longitude}`; // Create a unique key for the query

  console.log(key);

  // If key matches in cache and timestamp is less than 24 hours, use cache data
  if ( cache[key] && (Date.now() - cache[key].timestamp < twentyFourHoursInMs) ) {
    console.log('cache hit - sending data from cache');
    expressResponse.status(200).send({ data: cache[key].data, timestamp: cache[key].timestamp });

  } else {
    console.log('cache miss - making a new request');
    axios.get(url)
      .then(axiosResponse => axiosResponse.data.data.map( (day) => new DailyForecast(day)))
      .then(dailyForecastData => {
        const timeStamp = Date.now(); // Capture time stamp
        cache[key] = {}; // Create empty object for new data
        cache[key].data = dailyForecastData; // Store data
        cache[key].timestamp = timeStamp; // Update timestamp
        expressResponse.status(200).send({ data: dailyForecastData, timestamp: timeStamp }); // Send new data along with time stamp
      })
      .catch(errorMessage => {
        errorMessage = 'Internal Server Error, unable to show forecast';
        next({ message: errorMessage });
      });
  }
}

// Class - format weather data
class DailyForecast {
  constructor(obj){
    this.date = obj.datetime;
    this.description = `Low of ${obj.low_temp}, high of ${obj.high_temp} with ${obj.weather.description.toLowerCase()}`;
  }

}

module.exports = getWeather;
