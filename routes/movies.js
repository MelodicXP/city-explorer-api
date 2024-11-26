'use strict';

const express = require('express');
const axios = require('axios');
const database = require('../data/database');
const Movie = require('../modules/Movie');

const moviesRouter = express.Router();
const movieApiKey = process.env.MOVIE_API_KEY;

async function getMovies(request, response, next) {
  const city_name = request.query.query; // Destructure from request query
  const url = `https://api.themoviedb.org/3/search/movie?query=${city_name}&api_key=${movieApiKey}`;

  // Validate query parameters
  if (!city_name) {
    return response.status(400).send(validationError);
  }

  // If city name not in database 'cache', make API call || if in cache, check expiration
  if (database[city_name] === undefined || database[city_name].expiration < Date.now()) {
    console.log('Fetching from api...');
    const twentyFourHours = 86400000; // in milliseconds

    try {
      // Fetch data from the API
      const movieResponse = await axios.get(url);
      const movieData = createMovieData(movieResponse.data.results);

      // Update the database with new data and an updated expiration time
      database[city_name] = {content: movieData, expiration: Date.now() + twentyFourHours}; // 30 seconds cache time
      response.send(movieData);

    } catch (error) {
      console.error('Error fetching movie data', error);
      next(error);
    }

  } else {
    // If cache exists and hasn't expired, use the cached data
    console.log('Fetching from database...');
    response.status(200).json(database[city_name].content);
  }
};

function createMovieData(data) {
  return data.map((movie) => new Movie(movie));
};

moviesRouter.get('/movies', getMovies);

module.exports = moviesRouter;