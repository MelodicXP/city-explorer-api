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
  response.send('hello from the weather route!');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
