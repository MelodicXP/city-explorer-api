'use strict';

class Movie {
  constructor(obj){
    this.title = obj.title;
    this.overview = obj.overview;
    this.voteAverage = obj.vote_average;
    this.voteCount = obj.vote_count;
    this.imageURL = `https://www.themoviedb.org/t/p/w600_and_h900_bestv2${obj.poster_path}`;
    this.popularity = obj.popularity;
    this.releaseDate = obj.release_date;
  }
}

module.exports = Movie;
