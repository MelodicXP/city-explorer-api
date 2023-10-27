'use strict';

// todo - reactivate axios when switch to live
const axios = require('axios');

// todo - deactivate movieData when switch to live
// const movieData = require('./data/movies.json'); // Import movieData.json data into server

// todo - reactivate API_Keys when switch to live
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

// todo - function (future reference) - getMovies - original try/catch code
// // Function - getMovies
// async function getMovies(request, expressResponse, next) {

//   try {
//     // todo - reactivate this section when switch to live
//     // City name query from client
//     let searchQuery = request.query.searchQuery;

//     let url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;

//     const axiosResponse = await axios.get(url);

//     let localMovies = axiosResponse.data.results.map( (movie) => new LocalMovie(movie));

//     // todo - deactivate this section when switch to live

//     // Test local data connection
//     // let localMovies = movieData;
//     // console.log(localMovies);
//     // Use local weather data while testing
//     // let localMovies = movieData.results.map( (movie) => new LocalMovie(movie));
//     // work with static date to prevent multipleAPI requests while testing
//     // expressResponse.status(200).send(localMovies);

//     // todo - reactivate when switch to live
//     expressResponse.status(200).send(localMovies);

//   }
//   catch (error) {
//     const errorMessage = 'Internal Server Error, unable to show movies';
//     next({ message: errorMessage });
//   }
// }


// Function - refactored using .then() - use commented out code above for future reference when testing
function getMovies(request, expressResponse, next) {

  const searchQuery = request.query.searchQuery;
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&query=${searchQuery}`;

  axios.get(url)

    .then(axiosResponse => axiosResponse.data.results.map( (movie) => new LocalMovie(movie)))
    .then(localMovies => expressResponse.status(200).send(localMovies) )
    .catch(errorMessage => {
      errorMessage = 'Internal Server Error, unable to show movies';
      next({ message: errorMessage });
    });

}


// Class - format movie data
class LocalMovie {

  constructor(obj){

    this.title = obj.title;
    this.overview = obj.overview;
    this.voteAverage = obj.vote_average;
    this.voteCount = obj.vote_count;
    this.imageURL = obj.poster_path;
    this.popularity = obj.popularity;
    this.releaseDate = obj.release_date;

  }
}

module.exports = getMovies;
