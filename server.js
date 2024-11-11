'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express(); // Initiate express

app.use(cors()); // enable cross origin from different sources

const PORT = process.env.PORT || 3001;

app.get('/', (request, response) => {
  response.send('hello from the home route!');
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
