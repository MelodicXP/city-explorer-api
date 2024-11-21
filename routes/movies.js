'use strict';

const express = require('express');
const axios = require('axios');
const Movie = require('../modules/Movie');

const moviesRouter = express.Router();
const movieApiKey = process.env.MOVIE_API_KEY;

async function getMovies(request, response, next) {
  const city_name = request.query.query; // Destructure from request query

  // Validate query parameters
  if (!city_name) {
    return response.status(400).send(validationError);
  }

  const url = `https://api.themoviedb.org/3/search/movie?query=${city_name}&api_key=${movieApiKey}`;

  try {
    const movieResponse = await axios.get(url);
    const movieData = createMovieData(movieResponse.data.results);
    response.send(movieData);
  } catch (error) {
    console.error('Error fetching movie data', error);
    next(error);
  }
};

function createMovieData(data) {
  return data.map((movie) => new Movie(movie));
};

moviesRouter.get('/movies', getMovies);

module.exports = moviesRouter;